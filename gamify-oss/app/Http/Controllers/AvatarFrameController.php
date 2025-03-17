<?php

namespace App\Http\Controllers;

use App\Models\AvatarFrame;
use App\Models\UserAvatarFrame;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AvatarFrameController extends Controller
{
    /**
     * Get all avatar frames with their status for the current user.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get all avatar frames
        $allFrames = AvatarFrame::all();
        
        // Get user's unlocked frames
        $unlockedFrames = UserAvatarFrame::where('user_id', $user->user_id)
            ->get()
            ->keyBy('avatar_frame_id');
        
        // Enhance frames with unlocked/used status
        $enhancedFrames = $allFrames->map(function($frame) use ($unlockedFrames) {
            $isUnlocked = $frame->avatar_frame_id === 1 || isset($unlockedFrames[$frame->avatar_frame_id]);
            $isUsed = false;
            
            if ($isUnlocked) {
                if ($frame->avatar_frame_id === 1) {
                    // Default frame is used only if user has no other frame marked as used
                    $isUsed = !$unlockedFrames->contains('is_used', true);
                } else {
                    $isUsed = isset($unlockedFrames[$frame->avatar_frame_id]) && 
                             $unlockedFrames[$frame->avatar_frame_id]->is_used;
                }
            }
            
            // Get the frame image path
            $imagePath = self::getFrameImagePath($frame->name);
            
            return [
                'id' => $frame->avatar_frame_id,
                'name' => $frame->name,
                'description' => $frame->description,
                'image_path' => $imagePath,
                'is_unlocked' => $isUnlocked,
                'is_used' => $isUsed,
            ];
        });
        
        return response()->json(['frames' => $enhancedFrames]);
    }
    
    /**
     * Update the avatar frame used by the current user.
     */
    public function update(Request $request)
    {
        $request->validate([
            'frame_id' => 'required|exists:avatar_frames,avatar_frame_id',
        ]);
        
        $user = Auth::user();
        $frameId = $request->frame_id;
        
        // If switching to default frame (id 1)
        if ($frameId == 1) {
            // Set all frames to not used
            UserAvatarFrame::where('user_id', $user->user_id)
                ->update(['is_used' => false]);
                
            return response()->json(['message' => 'Default avatar frame selected successfully.']);
        }
        
        // Check if the user has unlocked this frame
        $frame = UserAvatarFrame::where('user_id', $user->user_id)
                                ->where('avatar_frame_id', $frameId)
                                ->first();
        
        if (!$frame) {
            return response()->json(['error' => 'This avatar frame is not unlocked yet.'], 400);
        }
        
        // Set all frames to not used
        UserAvatarFrame::where('user_id', $user->user_id)
            ->update(['is_used' => false]);
            
        // Set the selected frame to used
        $frame->is_used = true;
        $frame->save();
        
        return response()->json(['message' => 'Avatar frame updated successfully.']);
    }
    
    /**
     * Get the active avatar frame for a user.
     * 
     * @param \App\Models\User|null $user
     * @return string Path to the active frame image
     */
    public static function getUserActiveFramePath($user = null)
    {
        if (!$user) {
            $user = Auth::user();
            if (!$user) {
                return '/images/avatar-frames/default-frame.svg';
            }
        }
        
        // Get user's active frame
        $activeFrame = UserAvatarFrame::where('user_id', $user->user_id)
            ->where('is_used', true)
            ->first();
        
        if (!$activeFrame) {
            return '/images/avatar-frames/default-frame.svg';
        }
        
        // Get the frame details
        $frame = AvatarFrame::find($activeFrame->avatar_frame_id);
        if (!$frame) {
            return '/images/avatar-frames/default-frame.svg';
        }
        
        // Get the frame path
        return self::getFrameImagePath($frame->name);
    }
    
    /**
     * Get the image path for a frame based on its name.
     * 
     * @param string $frameName
     * @return string
     */
    public static function getFrameImagePath($frameName)
    {
        // Format the image path based on frame name with special case handling
        $frameNameMap = [
            // Special case mapping for frames with apostrophes
            'Code Weaver\'s Seal' => 'code-weaver\'s-seal',
            'Bug Hunter\'s Mark' => 'bug-hunter\'s-mark',
            'Rookie Adventurer\'s Crest' => 'rookie-adventurer\'s-crest',
            'The Bronze Harbinger' => 'the-bronze-harbinger',
            'The Silver Champion' => 'the-silver-champion',
            'The Gold Conqueror' => 'the-gold-conqueror',
            'Guiding Hand of the Community' => 'guiding-hand-of-the-community',
            'Unfolding Potential' => 'unfolding-potential',
            'Default' => 'default'
        ];
        
        // Check if we have a direct mapping for this frame
        if (array_key_exists($frameName, $frameNameMap)) {
            $formattedName = $frameNameMap[$frameName];
        } else {
            // Fall back to the generic formatter for other frames
            $formattedName = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $frameName));
            $formattedName = trim($formattedName, '-');
        }
        
        return '/images/avatar-frames/' . $formattedName . '-frame.svg';
    }
}