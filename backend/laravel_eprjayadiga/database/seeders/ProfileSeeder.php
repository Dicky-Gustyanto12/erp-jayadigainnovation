<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\User; 
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        
        $admin = User::query()->where('email', 'dickygustyanto12@gmail.com')->first();

   
        if ($admin) {
            Profile::query()->updateOrCreate(
                
                ['user_id' => $admin->id], 
                
                
                ['department' => 'IT']
            );
        }
    }
}