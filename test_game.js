#!/usr/bin/env node
/**
 * Test script to validate the JavaScript game engine works correctly.
 */

const { createDemoGame, Game } = require('./game_engine');

function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

async function testDemoGame() {
    console.log("Testing Fantasy Loop Game Engine (JavaScript)...");
    console.log("=".repeat(60));
    
    // Create game
    const game = createDemoGame();
    
    // Test look command
    console.log("\n1. Testing LOOK command:");
    let result = game.look();
    console.log(result);
    assert(result.includes("Castle Entrance"), "Look command failed");
    console.log("✓ Look command works");
    
    // Test inventory (should be empty)
    console.log("\n2. Testing INVENTORY command (empty):");
    result = game.showInventory();
    console.log(result);
    assert(result.toLowerCase().includes("empty"), "Empty inventory check failed");
    console.log("✓ Empty inventory works");
    
    // Test take item
    console.log("\n3. Testing TAKE command:");
    result = game.takeItem("sword");
    console.log(result);
    assert(result.toLowerCase().includes("took"), "Take command failed");
    console.log("✓ Take command works");
    
    // Test inventory (should have sword)
    console.log("\n4. Testing INVENTORY command (with item):");
    result = game.showInventory();
    console.log(result);
    assert(result.toLowerCase().includes("sword"), "Inventory with item failed");
    console.log("✓ Inventory with item works");
    
    // Test examine
    console.log("\n5. Testing EXAMINE command:");
    result = game.examineItem("sword");
    console.log(result);
    assert(result.toLowerCase().includes("iron sword"), "Examine command failed");
    console.log("✓ Examine command works");
    
    // Test use
    console.log("\n6. Testing USE command:");
    result = game.useItem("sword");
    console.log(result);
    assert(result.toLowerCase().includes("swing"), "Use command failed");
    console.log("✓ Use command works");
    
    // Test movement
    console.log("\n7. Testing MOVE command:");
    result = game.processCommand("go north");
    console.log(result);
    assert(result.includes("Great Hall"), "Movement failed");
    console.log("✓ Movement works");
    
    // Test invalid direction
    console.log("\n8. Testing invalid direction:");
    result = game.processCommand("go southeast");
    console.log(result);
    assert(result.toLowerCase().includes("can't go"), "Invalid direction check failed");
    console.log("✓ Invalid direction handled");
    
    // Test drop
    console.log("\n9. Testing DROP command:");
    result = game.dropItem("sword");
    console.log(result);
    assert(result.toLowerCase().includes("dropped"), "Drop command failed");
    console.log("✓ Drop command works");
    
    // Test status
    console.log("\n10. Testing STATUS command:");
    result = game.showStatus();
    console.log(result);
    assert(result.toLowerCase().includes("health"), "Status command failed");
    console.log("✓ Status command works");
    
    // Test help
    console.log("\n11. Testing HELP command:");
    result = game.showHelp();
    console.log(result.substring(0, 200) + "...");
    assert(result.toLowerCase().includes("commands"), "Help command failed");
    console.log("✓ Help command works");
    
    console.log("\n" + "=".repeat(60));
    console.log("All tests passed! ✓");
    console.log("=".repeat(60));
    return true;
}

async function testConfigLoading() {
    console.log("\n\nTesting config file loading...");
    console.log("=".repeat(60));
    
    const game = new Game();
    game.loadFromConfig("game_config.json");
    
    // Check game loaded
    console.log("\n1. Checking game loaded from config:");
    assert(game.game_title === "The Enchanted Forest", "Title not loaded");
    console.log(`   Title: ${game.game_title} ✓`);
    
    // Check rooms loaded
    console.log("\n2. Checking rooms loaded:");
    assert(game.rooms.size > 0, "No rooms loaded");
    console.log(`   Loaded ${game.rooms.size} rooms ✓`);
    
    // Check starting room
    console.log("\n3. Checking starting room:");
    const room = game.getCurrentRoom();
    assert(room !== null, "Starting room not found");
    console.log(`   Starting room: ${room.name} ✓`);
    
    // Test look in config game
    console.log("\n4. Testing LOOK in config game:");
    const result = game.look();
    console.log(result);
    assert(result.includes("Forest Clearing"), "Config game look failed");
    console.log("✓ Config game look works");
    
    console.log("\n" + "=".repeat(60));
    console.log("Config loading tests passed! ✓");
    console.log("=".repeat(60));
    return true;
}

// Run tests
(async () => {
    try {
        await testDemoGame();
        await testConfigLoading();
        console.log("\n🎉 All tests successful! The JavaScript game engine is working perfectly.");
        process.exit(0);
    } catch (error) {
        console.error(`\n❌ Test failed: ${error.message}`);
        console.error(error.stack);
        process.exit(1);
    }
})();
