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
        $user = Auth::user();

        // Get quests taken by the current user (status not "open" or "finished")
        $takenQuestIds = TakenQuest::where('user_id', $user->user_id)
            ->pluck('quest_id')
            ->toArray();

        $takenQuests = Quest::where('type', 'Advanced')
            ->whereIn('quest_id', $takenQuestIds)
            ->whereNotIn('status', ['open', 'finished'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get available quests (status "open")
        $availableQuests = Quest::where('type', 'Advanced')
            ->where('status', 'open')
            ->orderBy('created_at', 'desc')
            ->get();

        // Enhance taken quests with team information and submission data
        $enhancedTakenQuests = $takenQuests->map(function ($quest) use ($user) {
            $takenQuest = TakenQuest::where('quest_id', $quest->quest_id)
                ->where('user_id', $user->user_id)
                ->first();

            // Add status and submission images to the quest
            $quest->is_completed = !is_null($takenQuest->submission ?? null);
            $quest->is_taken = true;

            // Parse the JSON submission field if it exists
            if ($takenQuest && !is_null($takenQuest->submission)) {
                $submissionImages = json_decode($takenQuest->submission, true) ?? [];
                $quest->submission_images = $submissionImages;
            } else {
                $quest->submission_images = [];
            }

            // Get team members for this quest
            $teammates = TakenQuest::where('quest_id', $quest->quest_id)
                ->with('user:user_id,name,avatar,level')
                ->get()
                ->map(function ($takenQuest) {
                    return $takenQuest->user;
                });

            $quest->teammates = $teammates;

            return $quest;
        });

        // Enhance available quests with status information
        $enhancedAvailableQuests = $availableQuests->map(function ($quest) use ($user, $takenQuestIds) {
            // These quests are not taken by the current user
            $quest->is_completed = false;
            $quest->is_taken = false;
            $quest->submission_images = [];
            $quest->teammates = [];

            return $quest;
        });

        return Inertia::render('Quests/QuestBoard', [
            'takenQuests' => $enhancedTakenQuests,
            'availableQuests' => $enhancedAvailableQuests,
        ]);
    }

    /**
     * Display quests that have been taken by other users (not the current user)
     */
    public function communityTakenQuests(Request $request): Response
    {
        $user = Auth::user();

        // Get quests that are not "open" (have been taken by someone)
        $takenQuestIds = TakenQuest::pluck('quest_id')->unique()->toArray();

        // Get quests that are:
        // 1. taken (status is not "open")
        // 2. of type "Advanced"
        // 3. not taken by the current user (filtered later)
        $quests = Quest::whereIn('quest_id', $takenQuestIds)
            ->where('status', '!=', 'open')
            ->where('type', 'Advanced') // Only show Advanced quests
            ->orderBy('created_at', 'desc')
            ->get();

        // Get quests that the current user has taken
        $userTakenQuestIds = TakenQuest::where('user_id', $user->user_id)
            ->pluck('quest_id')
            ->toArray();

        // Enhance the quests with team information and other metadata
        $enhancedQuests = $quests->map(function ($quest) use ($userTakenQuestIds) {
            // Skip quests that the current user has taken
            if (in_array($quest->quest_id, $userTakenQuestIds)) {
                return null;
            }

            // Get all users who have taken this quest
            $questTakers = TakenQuest::where('quest_id', $quest->quest_id)
                ->with('user:user_id,name,avatar,level')
                ->get();

            // Check if any team member has completed the quest
            $anyCompleted = $questTakers->some(function ($takenQuest) {
                return !is_null($takenQuest->submission);
            });

            // This quest is taken by other users, so mark it as taken
            $quest->is_taken = true;
            $quest->is_completed = $anyCompleted;

            // Get the team members who are working on this quest
            $quest->teammates = $questTakers->map(function ($takenQuest) {
                return $takenQuest->user;
            });

            // Required level based on difficulty
            $quest->required_level = $quest->difficulty === "Hard" ? 4 : 3;

            return $quest;
        })
            ->filter() // Remove null values (quests taken by current user)
            ->values(); // Re-index the array

        return Inertia::render('Quests/TakenQuests', [
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
        if ((int)$currentUser->level < (int)$requiredLevel) {
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
        $availableUsers = $eligibleUsers->filter(function ($user) use ($takenUserIds) {
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
        if ((int)$currentUser->level < (int)$requiredLevel) {
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

                // Different handling for Advanced quests
                if ($quest->type === 'Advanced') {
                    // If this is an Advanced quest, update the status to "submitted"
                    if ($quest->status === 'in progress') {
                        $quest->status = 'submitted';
                        $quest->save();

                        logger('Advanced quest status updated to submitted', [
                            'quest_id' => $quest->quest_id,
                            'status' => $quest->status
                        ]);
                    }

                    // Copy the submission to all teammates' taken_quests
                    $teammateQuests = TakenQuest::where('quest_id', $quest->quest_id)
                        ->where('user_id', '!=', $user->user_id) // Skip current user
                        ->get();

                    foreach ($teammateQuests as $teammateQuest) {
                        $teammateQuest->submission = json_encode($imagePaths);
                        $teammateQuest->save();

                        logger('Copied submission to teammate', [
                            'teammate_id' => $teammateQuest->user_id,
                            'quest_id' => $quest->quest_id
                        ]);
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

    /**
     * Display quests that need admin approval/review.
     */
    public function receptionist(Request $request): Response
    {
        // Get quests waiting for initial approval (status = 'waiting')
        $waitingQuests = Quest::where('status', 'waiting')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get quests that have been submitted (we'll check for actual submissions)
        $inProgressQuests = Quest::where('status', 'in progress')
            ->orderBy('created_at', 'desc')
            ->get();

        // Find quests where at least one team member has submitted something
        $submittedQuests = collect();
        foreach ($inProgressQuests as $quest) {
            $hasSubmission = TakenQuest::where('quest_id', $quest->quest_id)
                ->whereNotNull('submission')
                ->exists();

            if ($hasSubmission) {
                // Mark as submitted for the frontend
                $quest->status = 'submitted';
                $submittedQuests->push($quest);
            }
        }

        // Combine waiting and submitted quests
        $allQuests = $waitingQuests->concat($submittedQuests);

        // Add necessary information to each quest
        $enhancedQuests = collect();
        foreach ($allQuests as $quest) {
            // Get all taken quests for this quest
            $takenQuests = TakenQuest::where('quest_id', $quest->quest_id)->get();

            // Skip if there are no taken quests
            if ($takenQuests->isEmpty()) {
                continue;
            }

            // Get team members
            $teammates = collect();
            foreach ($takenQuests as $takenQuest) {
                $user = User::where('user_id', $takenQuest->user_id)
                    ->select('user_id', 'name', 'avatar', 'level')
                    ->first();

                if ($user) {
                    $teammates->push($user);
                }
            }

            // Add team members to the quest
            $quest->teammates = $teammates;

            // For waiting quests, get request date
            if ($quest->status === 'waiting') {
                $firstTakenQuest = $takenQuests->sortBy('created_at')->first();
                if ($firstTakenQuest) {
                    $quest->request_date = $firstTakenQuest->created_at;
                }
            }

            // For submitted quests, get submission info
            if ($quest->status === 'submitted') {
                // Find the taken quest with a submission
                $submittedTakenQuest = $takenQuests->filter(function ($takenQuest) {
                    return !is_null($takenQuest->submission);
                })->first();

                if ($submittedTakenQuest) {
                    $quest->submit_date = $submittedTakenQuest->updated_at;
                    $quest->submission_images = json_decode($submittedTakenQuest->submission, true) ?? [];
                }
            }

            $enhancedQuests->push($quest);
        }

        return Inertia::render('Admin/Receptionist', [
            'quests' => $enhancedQuests,
        ]);
    }

    /**
     * Handle admin actions for approving or declining quests.
     */
    public function handleAdminAction(Request $request)
    {
        // Log received data for debugging using the logger helper function
        logger('Admin quest action received', [
            'quest_id' => $request->quest_id,
            'action' => $request->action
        ]);

        $request->validate([
            'quest_id' => 'required|exists:quests,quest_id',
            'action' => 'required|in:accept,decline',
        ]);

        $quest = Quest::findOrFail($request->quest_id);
        $currentStatus = $quest->status;

        logger('Current quest status', [
            'quest_id' => $quest->quest_id,
            'current_status' => $currentStatus
        ]);

        if ($request->action === 'accept') {
            if ($currentStatus === 'waiting') {
                // If approving a waiting quest, change status to "in progress"
                $quest->status = 'in progress';
                $quest->save();
                logger('Quest status updated to in progress');
            } elseif ($currentStatus === 'submitted') {
                // If approving a submitted quest, change status to "completed" and set finished_at
                $quest->status = 'completed';
                $quest->finished_at = now();
                $quest->save();
                logger('Quest status updated to completed');
            }
        } else {
            // If declining either a waiting or submitted quest, revert to "open"
            $quest->status = 'open';
            $quest->save();

            // Delete all taken_quests entries for this quest
            TakenQuest::where('quest_id', $quest->quest_id)->delete();
            logger('Quest status updated to open and taken_quests entries deleted');
        }

        return redirect()->route('receptionist')->with('success', 'Quest has been ' . ($request->action === 'accept' ? 'approved' : 'declined') . ' successfully.');
    }
}
