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
use App\Events\QuestCompletedEvent;
use App\Events\XpIncreasedEvent;

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

        // Log start of method
        logger('Quest board method called for user', ['user_id' => $user->user_id]);

        // Get quests taken by the current user (with status waiting, in progress, submitted, or finished)
        $takenQuestIds = TakenQuest::where('user_id', $user->user_id)
            ->pluck('quest_id')
            ->toArray();

        // Get all taken quests with any of these statuses
        $takenQuests = Quest::where('type', 'Advanced')
            ->whereIn('quest_id', $takenQuestIds)
            ->whereIn('status', ['waiting', 'in progress', 'submitted', 'finished'])
            ->orderBy('created_at', 'desc')
            ->get();

        logger('Taken quests count', ['count' => $takenQuests->count()]);

        // Get available quests (status "open")
        $availableQuests = Quest::where('type', 'Advanced')
            ->where('status', 'open')
            ->orderBy('created_at', 'desc')
            ->get();

        logger('Available quests count', ['count' => $availableQuests->count()]);

        // Enhance taken quests with team information and submission data
        $enhancedTakenQuests = $takenQuests->map(function ($quest) use ($user) {
            $takenQuest = TakenQuest::where('quest_id', $quest->quest_id)
                ->where('user_id', $user->user_id)
                ->first();

            // Add submission images to the quest
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
        // Start logging for debugging
        logger('Quest submission started', [
            'quest_id' => $request->quest_id,
            'user_id' => Auth::id(),
            'has_images' => $request->hasFile('images'),
            'image_count' => $request->hasFile('images') ? count($request->file('images')) : 0
        ]);

        try {
            $request->validate([
                'quest_id' => 'required|exists:quests,quest_id',
                'images' => 'required|array|min:1|max:3',
                'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $quest = Quest::findOrFail($request->quest_id);
            $user = Auth::user();

            logger('Quest found', [
                'quest_id' => $quest->quest_id,
                'type' => $quest->type,
                'status' => $quest->status
            ]);

            // Check if user has already taken this quest
            $existingTakenQuest = TakenQuest::where('user_id', $user->user_id)
                ->where('quest_id', $quest->quest_id)
                ->first();

            // If they haven't taken it yet, create a new record
            if (!$existingTakenQuest) {
                logger('No existing taken quest found, creating new record');
                $takenQuest = new TakenQuest();
                $takenQuest->user_id = $user->user_id;
                $takenQuest->quest_id = $quest->quest_id;
            } else {
                logger('Existing taken quest found', ['taken_quest_id' => $existingTakenQuest->taken_quest_id]);
                $takenQuest = $existingTakenQuest;
            }

            // Process image uploads
            $imagePaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    logger('Processing image', ['index' => $index, 'name' => $image->getClientOriginalName()]);
                    $path = $image->store('quest-submissions', 'public');
                    $imagePaths[] = $path;
                    logger('Image stored', ['path' => $path]);
                }

                // Store the image paths as a JSON array
                $takenQuest->submission = json_encode($imagePaths);
                $takenQuest->save();
                logger('Taken quest updated with submission', ['paths' => $imagePaths]);

                try {
                    // Log before dispatch
                    \Illuminate\Support\Facades\Log::info("Dispatching QuestCompletedEvent", [
                        'user_id' => $user->user_id,
                        'user_name' => $user->name,
                        'quest_id' => $quest->quest_id,
                        'quest_title' => $quest->title,
                        'quest_type' => $quest->type
                    ]);

                    // Dispatch the event for achievement tracking
                    event(new QuestCompletedEvent($user, $quest));

                    // Award XP for beginner quests that DON'T have corresponding achievements
                    if ($quest->type === 'Beginner') {
                        // Quests that have achievements - XP will be awarded when claimed
                        $achievementQuests = [1, 2, 4, 5]; 
                        
                        if (!in_array($quest->quest_id, $achievementQuests)) {
                            \Illuminate\Support\Facades\Log::info("Directly awarding XP for beginner quest without achievement", [
                                'user_id' => $user->user_id,
                                'quest_id' => $quest->quest_id,
                                'xp_amount' => $quest->xp_reward
                            ]);
                            
                            // Use DB update instead of $user->save()
                            $previousXp = $user->xp_point;
                            $newXp = $previousXp + $quest->xp_reward;
                            
                            // Update directly in the database
                            \App\Models\User::where('user_id', $user->user_id)
                                ->update(['xp_point' => $newXp]);
                            
                            \Illuminate\Support\Facades\Log::info("XP updated directly in database", [
                                'user_id' => $user->user_id,
                                'previous_xp' => $previousXp,
                                'new_xp' => $newXp,
                                'xp_added' => $quest->xp_reward
                            ]);
                            
                            // Refresh the user model from database
                            $user = \App\Models\User::find($user->user_id);
                            
                            // Dispatch event for level check
                            event(new XpIncreasedEvent($user, 0, 'beginner_quest_direct'));
                        } else {
                            \Illuminate\Support\Facades\Log::info("Not awarding XP for quest with achievement - will be awarded on claim", [
                                'user_id' => $user->user_id,
                                'quest_id' => $quest->quest_id
                            ]);
                        }
                    }

                    // Log after successful dispatch
                    \Illuminate\Support\Facades\Log::info("QuestCompletedEvent dispatched successfully");
                } catch (\Exception $e) {
                    // Log any errors
                    \Illuminate\Support\Facades\Log::error("Error in quest submission process", [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                }

                // Different handling for Advanced quests
                if ($quest->type === 'Advanced') {
                    // Update the status to "submitted" regardless of current status
                    $originalStatus = $quest->status;
                    $quest->status = 'submitted';
                    $quest->save();

                    logger('Advanced quest status updated', [
                        'quest_id' => $quest->quest_id,
                        'from_status' => $originalStatus,
                        'to_status' => 'submitted'
                    ]);

                    // Copy the submission to all teammates' taken_quests
                    $teammateQuests = TakenQuest::where('quest_id', $quest->quest_id)
                        ->where('user_id', '!=', $user->user_id) // Skip current user
                        ->get();

                    logger('Found teammate quests', ['count' => $teammateQuests->count()]);

                    foreach ($teammateQuests as $teammateQuest) {
                        $teammateQuest->submission = json_encode($imagePaths);
                        $teammateQuest->save();

                        logger('Copied submission to teammate', [
                            'teammate_id' => $teammateQuest->user_id,
                            'quest_id' => $quest->quest_id
                        ]);
                    }
                }

                logger('Submission successful, redirecting back');
                return redirect()->back()->with('success', 'Quest submission successful!');
            } else {
                logger('No images were uploaded in the request');
                return redirect()->back()->withErrors(['images' => 'No images were uploaded.']);
            }
        } catch (\Exception $e) {
            // Log the exception
            logger('Exception during quest submission', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            // Cleanup partially uploaded files
            foreach ($imagePaths ?? [] as $path) {
                Storage::disk('public')->delete($path);
                logger('Cleaned up file after error', ['path' => $path]);
            }

            return redirect()->back()->withErrors(['error' => 'Failed to upload images: ' . $e->getMessage()]);
        }
    }

    /**
     * Display quests that need admin approval/review.
     */
    public function receptionist(Request $request): Response
    {
        // Log the start of the method
        logger('Receptionist method called', ['time' => now()->toDateTimeString()]);

        // Get quests waiting for initial approval (status = 'waiting')
        $waitingQuests = Quest::where('status', 'waiting')
            ->orderBy('created_at', 'desc')
            ->get();
        logger('Waiting quests count', ['count' => $waitingQuests->count()]);

        // Get quests with "submitted" status (direct query)
        $submittedQuests = Quest::where('status', 'submitted')
            ->orderBy('created_at', 'desc')
            ->get();
        logger('Submitted quests count', ['count' => $submittedQuests->count()]);

        // Enhance waiting quests with team info and dates
        $enhancedWaitingQuests = $waitingQuests->map(function ($quest) {
            $takenQuests = TakenQuest::where('quest_id', $quest->quest_id)->get();

            // Get team members
            $teammates = $takenQuests->map(function ($takenQuest) {
                return User::where('user_id', $takenQuest->user_id)
                    ->select('user_id', 'name', 'avatar', 'level')
                    ->first();
            });

            $quest->teammates = $teammates;

            // Get request date (use created_at of taken_quest)
            $firstTakenQuest = $takenQuests->sortBy('created_at')->first();
            if ($firstTakenQuest) {
                $quest->request_date = $firstTakenQuest->created_at;
            }

            return $quest;
        });

        // Enhance submitted quests with team info, dates, and submission images
        $enhancedSubmittedQuests = $submittedQuests->map(function ($quest) {
            $takenQuests = TakenQuest::where('quest_id', $quest->quest_id)->get();

            // Get team members
            $teammates = $takenQuests->map(function ($takenQuest) {
                return User::where('user_id', $takenQuest->user_id)
                    ->select('user_id', 'name', 'avatar', 'level')
                    ->first();
            });

            $quest->teammates = $teammates;

            // Get most recent submission date
            $lastSubmissionQuest = $takenQuests
                ->filter(function ($takenQuest) {
                    return !is_null($takenQuest->submission);
                })
                ->sortByDesc('updated_at')
                ->first();

            if ($lastSubmissionQuest) {
                $quest->submit_date = $lastSubmissionQuest->updated_at;

                // Collect all submission images
                $submissionImages = json_decode($lastSubmissionQuest->submission, true) ?? [];
                $quest->submission_images = $submissionImages;

                logger('Found submission images', [
                    'quest_id' => $quest->quest_id,
                    'image_count' => count($submissionImages)
                ]);
            }

            return $quest;
        });

        // Combine all quests
        $allQuests = $enhancedWaitingQuests->concat($enhancedSubmittedQuests);

        logger('Total quests being sent to view', ['count' => $allQuests->count()]);

        return Inertia::render('Admin/Receptionist', [
            'quests' => $allQuests,
        ]);
    }

    /**
     * Handle admin actions for approving or declining quests.
     */
    public function handleAdminAction(Request $request)
    {
        // Log received data for debugging
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
                // If approving a submitted quest, change status to "finished" and set finished_at
                $quest->status = 'finished';
                $quest->finished_at = now();
                $quest->save();
                logger('Quest status updated to finished');

                // Get all team members who worked on this quest
                $takenQuests = TakenQuest::where('quest_id', $quest->quest_id)->get();
                $teamSize = $takenQuests->count();

                // Calculate XP reward based on team size
                $xpReward = $quest->xp_reward;
                $xpReduction = 0;

                // Apply team size reduction
                if ($teamSize > 1) {
                    // Team size reduction: 10% per additional member
                    $xpReduction = min(0.4, ($teamSize - 1) * 0.1);
                    $xpReward = intval($xpReward * (1 - $xpReduction));

                    logger('XP reward adjusted for team size', [
                        'quest_id' => $quest->quest_id,
                        'team_size' => $teamSize,
                        'original_xp' => $quest->xp_reward,
                        'reduction_percent' => $xpReduction * 100 . '%',
                        'adjusted_xp' => $xpReward
                    ]);
                }

                // Award XP to each team member
                foreach ($takenQuests as $takenQuest) {
                    $user = User::find($takenQuest->user_id);
                    if ($user) {
                        event(new \App\Events\XpIncreasedEvent($user, $xpReward, 'advanced_quest'));
                        logger('XP awarded to user', [
                            'user_id' => $user->user_id,
                            'user_name' => $user->name,
                            'xp_amount' => $xpReward,
                            'quest_id' => $quest->quest_id
                        ]);
                    }
                }
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
