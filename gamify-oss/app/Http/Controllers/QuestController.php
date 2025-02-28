<?php

namespace App\Http\Controllers;

use App\Models\Quest;
use App\Models\TakenQuest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class QuestController extends Controller
{
    /**
     * Display a listing of beginner quests.
     */
    public function index(Request $request): Response
    {
        $quests = Quest::where('type', 'Beginner')->get();

        return Inertia::render('Quests/BeginnerQuests', [
            'quests' => $quests,
        ]);
    }
}
