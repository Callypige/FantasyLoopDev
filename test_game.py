#!/usr/bin/env python3
"""Test script to validate the game engine works correctly."""

import sys
from game_engine import create_demo_game, Game

def test_demo_game():
    """Test the demo game with various commands."""
    print("Testing Fantasy Loop Game Engine...")
    print("=" * 60)
    
    # Create game
    game = create_demo_game()
    
    # Test look command
    print("\n1. Testing LOOK command:")
    result = game.look()
    print(result)
    assert "Castle Entrance" in result, "Look command failed"
    print("✓ Look command works")
    
    # Test inventory (should be empty)
    print("\n2. Testing INVENTORY command (empty):")
    result = game.show_inventory()
    print(result)
    assert "empty" in result.lower(), "Empty inventory check failed"
    print("✓ Empty inventory works")
    
    # Test take item
    print("\n3. Testing TAKE command:")
    result = game.take_item("sword")
    print(result)
    assert "took" in result.lower(), "Take command failed"
    print("✓ Take command works")
    
    # Test inventory (should have sword)
    print("\n4. Testing INVENTORY command (with item):")
    result = game.show_inventory()
    print(result)
    assert "sword" in result.lower(), "Inventory with item failed"
    print("✓ Inventory with item works")
    
    # Test examine
    print("\n5. Testing EXAMINE command:")
    result = game.examine_item("sword")
    print(result)
    assert "iron sword" in result.lower(), "Examine command failed"
    print("✓ Examine command works")
    
    # Test use
    print("\n6. Testing USE command:")
    result = game.use_item("sword")
    print(result)
    assert "swing" in result.lower(), "Use command failed"
    print("✓ Use command works")
    
    # Test movement
    print("\n7. Testing MOVE command:")
    result = game.process_command("go north")
    print(result)
    assert "Great Hall" in result, "Movement failed"
    print("✓ Movement works")
    
    # Test invalid direction
    print("\n8. Testing invalid direction:")
    result = game.process_command("go southeast")
    print(result)
    assert "can't go" in result.lower(), "Invalid direction check failed"
    print("✓ Invalid direction handled")
    
    # Test drop
    print("\n9. Testing DROP command:")
    result = game.drop_item("sword")
    print(result)
    assert "dropped" in result.lower(), "Drop command failed"
    print("✓ Drop command works")
    
    # Test status
    print("\n10. Testing STATUS command:")
    result = game.show_status()
    print(result)
    assert "health" in result.lower(), "Status command failed"
    print("✓ Status command works")
    
    # Test help
    print("\n11. Testing HELP command:")
    result = game.show_help()
    print(result[:200] + "...")
    assert "commands" in result.lower(), "Help command failed"
    print("✓ Help command works")
    
    print("\n" + "=" * 60)
    print("All tests passed! ✓")
    print("=" * 60)
    return True

def test_config_loading():
    """Test loading game from config file."""
    print("\n\nTesting config file loading...")
    print("=" * 60)
    
    game = Game()
    game.load_from_config("game_config.json")
    
    # Check game loaded
    print("\n1. Checking game loaded from config:")
    assert game.game_title == "The Enchanted Forest", "Title not loaded"
    print(f"   Title: {game.game_title} ✓")
    
    # Check rooms loaded
    print("\n2. Checking rooms loaded:")
    assert len(game.rooms) > 0, "No rooms loaded"
    print(f"   Loaded {len(game.rooms)} rooms ✓")
    
    # Check starting room
    print("\n3. Checking starting room:")
    room = game.get_current_room()
    assert room is not None, "Starting room not found"
    print(f"   Starting room: {room.name} ✓")
    
    # Test look in config game
    print("\n4. Testing LOOK in config game:")
    result = game.look()
    print(result)
    assert "Forest Clearing" in result, "Config game look failed"
    print("✓ Config game look works")
    
    print("\n" + "=" * 60)
    print("Config loading tests passed! ✓")
    print("=" * 60)
    return True

if __name__ == "__main__":
    try:
        test_demo_game()
        test_config_loading()
        print("\n🎉 All tests successful! The game engine is working perfectly.")
        sys.exit(0)
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
