#!/usr/bin/env python3
"""
Simple interactive script to help users get started with Fantasy Loop.
"""

import os
import sys
import shutil

def main():
    print("=" * 60)
    print("Fantasy Loop - Getting Started".center(60))
    print("=" * 60)
    print()
    
    print("Welcome! Let's set up your first text adventure game.")
    print()
    
    # Check if game_config.json already exists
    if os.path.exists("game_config.json"):
        print("⚠️  game_config.json already exists!")
        response = input("Do you want to overwrite it? (yes/no): ").lower()
        if response not in ['yes', 'y']:
            print("\nOkay! Your existing game_config.json is safe.")
            print("You can manually copy from the examples/ folder if you want.")
            return
    
    print("\nChoose a starting template:")
    print("1. The Enchanted Forest (Fantasy - Beginner Friendly)")
    print("2. The Mystery House (Mystery/Horror - Intermediate)")
    print("3. Space Station Alpha (Sci-Fi - Intermediate)")
    print("4. Empty Template (Start from scratch)")
    print()
    
    choice = input("Enter your choice (1-4): ").strip()
    
    templates = {
        "1": ("game_config.json", "The Enchanted Forest"),
        "2": ("examples/mystery_house.json", "The Mystery House"),
        "3": ("examples/space_station.json", "Space Station Alpha"),
        "4": ("examples/template.json", "Empty Template")
    }
    
    if choice not in templates:
        print("\n❌ Invalid choice. Please run the script again.")
        return
    
    source, name = templates[choice]
    
    try:
        if choice == "1":
            # Already exists as game_config.json, no need to copy
            print(f"\n✓ Using {name}")
        else:
            shutil.copy(source, "game_config.json")
            print(f"\n✓ Copied {name} to game_config.json")
        
        print("\nYou're all set! To start your game:")
        print()
        print("  Python:     python game_engine.py")
        print("  JavaScript: node game_engine.js")
        print("  TypeScript: npm run start:ts")
        print()
        print("📚 Check out QUICKSTART.md for a tutorial!")
        print("📖 Read README.md for complete documentation.")
        print()
        
        # Ask if they want to start the game now
        start_now = input("Would you like to start the game now? (yes/no): ").lower()
        if start_now in ['yes', 'y']:
            print("\nStarting game...\n")
            from game_engine import Game
            game = Game()
            game.load_from_config("game_config.json")
            game.start()
        else:
            print("\nHave fun creating your adventure! 🎮✨")
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nSetup cancelled.")
        sys.exit(0)
