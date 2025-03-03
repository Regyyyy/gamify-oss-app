<?php

namespace App\Http\Controllers;

use App\Models\Quest;
use App\Models\TakenQuest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class QuestController extends Controller
{
    /**
     * Display a listing of beginner quests.
     */
    public function index(Request $request): Response
    {
        $quests = Quest::where('type', 'Beginner')->get();
        $user = Auth::user();
        
        // Get all quest IDs
        $questIds = $quests->pluck('quest_id')->toArray();
        
        // Get all taken quests for this user that match these quest IDs
        $takenQuests = TakenQuest::where('user_id', $user->user_id)
            ->whereIn('quest_id', $questIds)
            ->whereNotNull('submission')
            ->get()
            ->keyBy('quest_id');
        
        // Enhance the quests with completion status and submission data
        $enhancedQuests = $quests->map(function ($quest) use ($takenQuests) {
            $takenQuest = $takenQuests->get($quest->quest_id);
            
            if ($takenQuest) {
                // Add completed status and submission images to the quest
                $quest->is_completed = true;
                
                // Parse the JSON submission field
                $submissionImages = json_decode($takenQuest->submission, true) ?? [];
                $quest->submission_images = $submissionImages;
            } else {
                $quest->is_completed = false;
                $quest->submission_images = [];
            }
            
            return $quest;
        });

        return Inertia::render('Quests/BeginnerQuests', [
            'quests' => $enhancedQuests,
        ]);
    }

    /**
     * Display the quest board with advanced quests.
     */
    public function questBoard(Request $request): Response
    {
        $quests = Quest::where('type', 'Advanced')
            ->orderBy('created_at', 'desc') // Order by creation time, newest first
            ->get();
        $user = Auth::user();
        
        // Get all quest IDs
        $questIds = $quests->pluck('quest_id')->toArray();
        
        // Get all taken quests for this user that match these quest IDs
        $takenQuests = TakenQuest::where('user_id', $user->user_id)
            ->whereIn('quest_id', $questIds)
            ->get()
            ->keyBy('quest_id');
        
        // Enhance the quests with completion status, submission data, and team information
        $enhancedQuests = $quests->map(function ($quest) use ($takenQuests) {
            $takenQuest = $takenQuests->get($quest->quest_id);
            
            if ($takenQuest) {
                // Add status and submission images to the quest
                $quest->is_completed = !is_null($takenQuest->submission);
                $quest->is_taken = true;
                
                // Parse the JSON submission field if it exists
                if (!is_null($takenQuest->submission)) {
                    $submissionImages = json_decode($takenQuest->submission, true) ?? [];
                    $quest->submission_images = $submissionImages;
                } else {
                    $quest->submission_images = [];
                }
                
                // Get team members for this quest
                $teammates = TakenQuest::where('quest_id', $quest->quest_id)
                    ->where('user_id', '!=', Auth::user()->user_id)
                    ->with('user:user_id,name,avatar,level')
                    ->get()
                    ->map(function($takenQuest) {
                        return $takenQuest->user;
                    });
                
                $quest->teammates = $teammates;
            } else {
                $quest->is_completed = false;
                $quest->is_taken = false;
                $quest->submission_images = [];
                $quest->teammates = [];
            }
            
            return $quest;
        });

        return Inertia::render('Quests/QuestBoard', [
            'quests' => $enhancedQuests,
        ]);
    }

    /**
     * Show the form for creating a new quest.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/AddNewQuest');
    }

    /**
     * Store a newly created quest in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'issue_link' => 'nullable|url|max:255',
            'role' => 'required|string',
            'difficulty' => 'required|string|in:Easy,Medium,Hard',
            'xp_reward' => 'required|integer|min:0',
            'proficiency_reward' => 'nullable|integer|min:0',
        ]);

        // Set role to null if it's "None"
        $role = $request->role === 'None' ? null : $request->role;

        // Create the quest
        $quest = Quest::create([
            'title' => $request->title,
            'description' => $request->description,
            'issue_link' => $request->issue_link,
            'type' => 'Advanced',
            'role' => $role,
            'difficulty' => $request->difficulty,
            'xp_reward' => $request->xp_reward,
            'proficiency_reward' => $request->proficiency_reward,
            'status' => 'open',
        ]);

        return redirect()->route('questboard')->with('success', 'Quest created successfully!');
    }

    /**
     * Get eligible users for team selection.
     * Returns users who have level greater than or equal to the required level.
     */
    public function getEligibleUsers(Request $request)
    {
        $request->validate([
            'quest_id' => 'required|exists:quests,quest_id',
        ]);

        $quest = Quest::findOrFail($request->quest_id);
        $requiredLevel = 0;
        
        // Set required level based on quest difficulty
        if ($quest->difficulty === 'Hard') {
            $requiredLevel = 4;
        } elseif ($quest->difficulty === 'Medium') {
            $requiredLevel = 3;
        } else {
            $requiredLevel = 2;
        }
        
        // Check if current user meets the level requirement
        $currentUser = Auth::user();
        if ($currentUser->level < $requiredLevel) {
            return response()->json([
                'error' => 'You do not meet the level requirement for this quest.',
                'users' => []
            ], 403);
        }

        // Get users who are eligible (level >= required level)
        $eligibleUsers = User::where('level', '>=', $requiredLevel)
            ->where('user_id', '!=', Auth::user()->user_id)
            ->select('user_id', 'name', 'avatar', 'level')
            ->get();

        // Check if the quest is already taken by any of these users
        $takenUserIds = TakenQuest::where('quest_id', $quest->quest_id)
            ->pluck('user_id')
            ->toArray();

        // Filter out users who have already taken this quest
        $availableUsers = $eligibleUsers->filter(function($user) use ($takenUserIds) {
            return !in_array($user->user_id, $takenUserIds);
        })->values();

        return response()->json(['users' => $availableUsers]);
    }

    /**
     * Take a quest with team members.
     */
    public function takeQuest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'quest_id' => 'required|exists:quests,quest_id',
            'team_members' => 'nullable|array',
            'team_members.*' => 'exists:users,user_id',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }

        $quest = Quest::findOrFail($request->quest_id);
        $currentUser = Auth::user();
        
        // Check if user meets the level requirement
        $requiredLevel = $quest->difficulty === "Hard" ? 4 : 3; // Same logic as in QuestBoard.jsx
        if ($currentUser->level < $requiredLevel) {
            return redirect()->back()->withErrors(['level' => "You don't meet the level requirement for this quest."]);
        }

        // Check if the user already has taken this quest
        $existingTakenQuest = TakenQuest::where('user_id', $currentUser->user_id)
            ->where('quest_id', $quest->quest_id)
            ->first();

        if ($existingTakenQuest) {
            return redirect()->back()->with('error', 'You have already taken this quest.');
        }

        // Create taken quest for current user
        TakenQuest::create([
            'user_id' => $currentUser->user_id,
            'quest_id' => $quest->quest_id,
            'submission' => null
        ]);

        // If team members are selected, create taken quests for them
        if ($request->has('team_members') && is_array($request->team_members)) {
            foreach ($request->team_members as $memberId) {
                // Skip if member has already taken this quest
                $existingMemberTaken = TakenQuest::where('user_id', $memberId)
                    ->where('quest_id', $quest->quest_id)
                    ->first();
                
                if (!$existingMemberTaken) {
                    TakenQuest::create([
                        'user_id' => $memberId,
                        'quest_id' => $quest->quest_id,
                        'submission' => null
                    ]);
                }
            }
        }

        // Update quest status to "waiting"
        $quest->status = 'waiting';
        $quest->save();

        return redirect()->back()->with('success', 'Quest taken successfully with your team!');
    }

    /**
     * Submit a quest with screenshots.
     */
    public function submit(Request $request)
    {
        $request->validate([
            'quest_id' => 'required|exists:quests,quest_id',
            'images' => 'required|array|min:1|max:3',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $quest = Quest::findOrFail($request->quest_id);
        $user = Auth::user();

        // Check if user has already taken this quest
        $existingTakenQuest = TakenQuest::where('user_id', $user->user_id)
            ->where('quest_id', $quest->quest_id)
            ->first();

        // If they haven't taken it yet, create a new record
        if (!$existingTakenQuest) {
            $takenQuest = new TakenQuest();
            $takenQuest->user_id = $user->user_id;
            $takenQuest->quest_id = $quest->quest_id;
        } else {
            $takenQuest = $existingTakenQuest;
        }

        // Process image uploads
        $imagePaths = [];
        try {
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('quest-submissions', 'public');
                    $imagePaths[] = $path;
                }

                // Store the image paths as a JSON array
                $takenQuest->submission = json_encode($imagePaths);
                $takenQuest->save();

                // If this is an advanced quest and all team members have submitted,
                // change the quest status to completed
                if ($quest->type === 'Advanced') {
                    $allTeamMembers = TakenQuest::where('quest_id', $quest->quest_id)->get();
                    $allSubmitted = $allTeamMembers->every(function($member) {
                        return !is_null($member->submission);
                    });
                    
                    if ($allSubmitted) {
                        $quest->status = 'completed';
                        $quest->finished_at = now();
                        $quest->save();
                    }
                }

                return redirect()->back()->with('success', 'Quest submission successful!');
            }
            
            return redirect()->back()->withErrors(['images' => 'No images were uploaded.']);
        } catch (\Exception $e) {
            // Cleanup partially uploaded files
            foreach ($imagePaths as $path) {
                Storage::disk('public')->delete($path);
            }

            return redirect()->back()->withErrors(['error' => 'Failed to upload images: ' . $e->getMessage()]);
        }
    }
}