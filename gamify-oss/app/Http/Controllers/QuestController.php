<?php

namespace App\Http\Controllers;

use App\Models\Quest;
use App\Models\TakenQuest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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