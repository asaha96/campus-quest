import { TILES } from '../data/maps'

// Simple pseudo-random number generator for consistent seedable results if needed
const random = () => Math.random()

// Building configurations - positions relative to center
// Door coordinates must match CAMPUS_DOORS in zones.js
const BUILDINGS = {
    library: {
        relX: -14, // Left of center
        relY: -12, // Above center
        width: 11,
        height: 6,
        doorOffsetX: 5, // Door in middle of bottom wall
        name: 'Library',
        emoji: '📚',
        style: 'library',
    },
    gym: {
        relX: -14, // Left of center
        relY: 6,   // Below center
        width: 11,
        height: 6,
        doorOffsetX: 5,
        name: 'Gym',
        emoji: '🏋️',
        style: 'gym',
    },
    cafe: {
        relX: 4,   // Right of center
        relY: -12, // Above center
        width: 9,
        height: 5,
        doorOffsetX: 4,
        name: 'Cafe',
        emoji: '☕',
        style: 'cafe',
    },
    dorm: {
        relX: 4,   // Right of center
        relY: 6,   // Below center
        width: 10,
        height: 7,
        doorOffsetX: 5,
        name: 'Dorm',
        emoji: '🏠',
        style: 'dorm',
    },
}

// Place a building on the grid with detailed exterior
const placeBuilding = (grid, centerX, centerY, building, buildingObjects) => {
    const startX = centerX + building.relX
    const startY = centerY + building.relY
    const endX = startX + building.width - 1
    const endY = startY + building.height - 1

    // Clear larger area around building for yard/plaza
    for (let y = startY - 3; y <= endY + 4; y++) {
        for (let x = startX - 3; x <= endX + 3; x++) {
            if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
                grid[y][x] = TILES.GRASS
            }
        }
    }

    // Place building foundation/walls
    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
                grid[y][x] = TILES.WALL
            }
        }
    }

    // Place door at bottom center
    const doorX = startX + building.doorOffsetX
    const doorY = endY
    if (doorY >= 0 && doorY < grid.length && doorX >= 0 && doorX < grid[0].length) {
        grid[doorY][doorX] = TILES.DOOR
    }

    // Create path/plaza leading to door
    for (let y = doorY + 1; y <= doorY + 3; y++) {
        if (y >= 0 && y < grid.length) {
            // Wide entrance path
            for (let dx = -1; dx <= 1; dx++) {
                const px = doorX + dx
                if (px >= 0 && px < grid[0].length) {
                    grid[y][px] = TILES.PATH
                }
            }
        }
    }

    // Add decorative elements based on building style
    addBuildingDecorations(grid, startX, startY, endX, endY, doorX, doorY, building, buildingObjects)

    return { doorX, doorY, startX, startY, endX, endY }
}

// Add style-specific decorations around buildings
const addBuildingDecorations = (grid, startX, startY, endX, endY, doorX, doorY, building, buildingObjects) => {
    const height = grid.length
    const width = grid[0].length

    // Add building sign/label
    buildingObjects.push({
        x: doorX,
        y: startY - 1,
        emoji: building.emoji,
        name: building.name,
        type: 'sign',
    })

    switch (building.style) {
        case 'library':
            // Add trees flanking the entrance
            if (startX - 1 >= 0 && doorY + 2 < height) {
                grid[doorY + 2][startX - 1] = TILES.TREE
            }
            if (endX + 1 < width && doorY + 2 < height) {
                grid[doorY + 2][endX + 1] = TILES.TREE
            }
            // Add bench near entrance
            buildingObjects.push({
                x: doorX - 2,
                y: doorY + 2,
                emoji: '🪑',
                name: 'Bench',
                type: 'decoration',
            })
            // Add lamp posts
            buildingObjects.push({
                x: startX,
                y: doorY + 1,
                emoji: '🏮',
                name: 'Lamp',
                type: 'decoration',
            })
            buildingObjects.push({
                x: endX,
                y: doorY + 1,
                emoji: '🏮',
                name: 'Lamp',
                type: 'decoration',
            })
            break

        case 'gym':
            // Add sports equipment decorations
            buildingObjects.push({
                x: startX - 1,
                y: startY + 2,
                emoji: '⚽',
                name: 'Soccer Ball',
                type: 'decoration',
            })
            buildingObjects.push({
                x: endX + 1,
                y: startY + 2,
                emoji: '🏀',
                name: 'Basketball',
                type: 'decoration',
            })
            // Track/running area
            for (let x = startX; x <= endX; x++) {
                if (doorY + 4 < height && x >= 0 && x < width) {
                    grid[doorY + 4][x] = TILES.PATH
                }
            }
            buildingObjects.push({
                x: doorX,
                y: doorY + 4,
                emoji: '🏃',
                name: 'Track',
                type: 'decoration',
            })
            break

        case 'cafe':
            // Outdoor seating area
            buildingObjects.push({
                x: startX - 1,
                y: doorY + 1,
                emoji: '☂️',
                name: 'Patio Umbrella',
                type: 'decoration',
            })
            buildingObjects.push({
                x: endX + 1,
                y: doorY + 1,
                emoji: '☂️',
                name: 'Patio Umbrella',
                type: 'decoration',
            })
            // Flower decorations
            buildingObjects.push({
                x: startX,
                y: startY - 1,
                emoji: '🌸',
                name: 'Flowers',
                type: 'decoration',
            })
            buildingObjects.push({
                x: endX,
                y: startY - 1,
                emoji: '🌺',
                name: 'Flowers',
                type: 'decoration',
            })
            break

        case 'dorm':
            // Bike rack
            buildingObjects.push({
                x: startX - 1,
                y: doorY + 1,
                emoji: '🚲',
                name: 'Bike Rack',
                type: 'decoration',
            })
            // Mailbox
            buildingObjects.push({
                x: endX + 1,
                y: doorY + 1,
                emoji: '📮',
                name: 'Mailbox',
                type: 'decoration',
            })
            // Trees around dorm
            if (startX - 2 >= 0 && startY >= 0) {
                grid[startY][startX - 2] = TILES.TREE
            }
            if (endX + 2 < width && startY >= 0) {
                grid[startY][endX + 2] = TILES.TREE
            }
            break
    }
}

export const generateMap = (width = 100, height = 100) => {
    // Initialize grid with grass
    const grid = Array(height).fill().map(() => Array(width).fill(TILES.GRASS))

    // Track decorative objects to render on top of the map
    const buildingObjects = []

    const centerX = Math.floor(width / 2)
    const centerY = Math.floor(height / 2)

    // 1. Scatter some trees (Cellular Automata initialization)
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Less trees near center (campus quad)
            const distFromCenter = Math.abs(x - centerX) + Math.abs(y - centerY)
            const treeChance = distFromCenter < 25 ? 0.03 : distFromCenter < 40 ? 0.1 : 0.2
            if (random() < treeChance) {
                grid[y][x] = TILES.TREE
            }
        }
    }

    // 2. Cellular Automata smoothing (make forests clumpier)
    for (let iter = 0; iter < 3; iter++) {
        const newGrid = grid.map(row => [...row])
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let neighborTrees = 0
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (grid[y + dy][x + dx] === TILES.TREE) neighborTrees++
                    }
                }

                if (neighborTrees > 4) newGrid[y][x] = TILES.TREE
                else if (neighborTrees < 3) newGrid[y][x] = TILES.GRASS
            }
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                grid[y][x] = newGrid[y][x]
            }
        }
    }

    // 3. Create main campus quad (clear central area)
    for (let y = centerY - 18; y <= centerY + 18; y++) {
        for (let x = centerX - 18; x <= centerX + 18; x++) {
            if (y >= 0 && y < height && x >= 0 && x < width) {
                grid[y][x] = TILES.GRASS
            }
        }
    }

    // 4. Create main paths in a cross pattern
    // Horizontal main path
    for (let x = centerX - 20; x <= centerX + 20; x++) {
        if (x >= 0 && x < width) {
            grid[centerY][x] = TILES.PATH
            grid[centerY - 1][x] = TILES.PATH
            grid[centerY + 1][x] = TILES.PATH
        }
    }

    // Vertical main path
    for (let y = centerY - 20; y <= centerY + 20; y++) {
        if (y >= 0 && y < height) {
            grid[y][centerX] = TILES.PATH
            grid[y][centerX - 1] = TILES.PATH
            grid[y][centerX + 1] = TILES.PATH
        }
    }

    // 5. Place all buildings at fixed positions
    const doorPositions = {}
    Object.entries(BUILDINGS).forEach(([name, building]) => {
        const result = placeBuilding(grid, centerX, centerY, building, buildingObjects)
        doorPositions[name] = { x: result.doorX, y: result.doorY }
    })

    // 6. Create paths connecting buildings to main paths
    Object.entries(doorPositions).forEach(([name, { x: doorX, y: doorY }]) => {
        // Connect door path to nearest main path
        const building = BUILDINGS[name]

        if (building.relY < 0) {
            // Building is above center - connect downward
            for (let y = doorY + 3; y <= centerY; y++) {
                if (y >= 0 && y < height) {
                    grid[y][doorX] = TILES.PATH
                    if (doorX - 1 >= 0) grid[y][doorX - 1] = TILES.PATH
                }
            }
        } else {
            // Building is below center - connect upward
            for (let y = centerY; y <= doorY + 3; y++) {
                if (y >= 0 && y < height) {
                    grid[y][doorX] = TILES.PATH
                    if (doorX - 1 >= 0) grid[y][doorX - 1] = TILES.PATH
                }
            }
        }
    })

    // 7. Add central fountain/plaza
    const fountainSize = 3
    for (let dy = -fountainSize; dy <= fountainSize; dy++) {
        for (let dx = -fountainSize; dx <= fountainSize; dx++) {
            const dist = Math.abs(dx) + Math.abs(dy)
            const fx = centerX + dx
            const fy = centerY + dy
            if (fy >= 0 && fy < height && fx >= 0 && fx < width) {
                if (dist <= 2) {
                    grid[fy][fx] = TILES.WATER // Fountain water
                } else if (dist <= fountainSize) {
                    grid[fy][fx] = TILES.PATH // Surrounding path
                }
            }
        }
    }
    // Fountain decoration
    buildingObjects.push({
        x: centerX,
        y: centerY,
        emoji: '⛲',
        name: 'Campus Fountain',
        type: 'landmark',
    })

    // 8. Add benches around the quad
    const benchPositions = [
        { x: centerX - 6, y: centerY - 4 },
        { x: centerX + 6, y: centerY - 4 },
        { x: centerX - 6, y: centerY + 4 },
        { x: centerX + 6, y: centerY + 4 },
    ]
    benchPositions.forEach(pos => {
        if (pos.y >= 0 && pos.y < height && pos.x >= 0 && pos.x < width) {
            grid[pos.y][pos.x] = TILES.PATH
            buildingObjects.push({
                x: pos.x,
                y: pos.y,
                emoji: '🪑',
                name: 'Bench',
                type: 'decoration',
            })
        }
    })

    // 9. Add lamp posts along main paths
    for (let i = -15; i <= 15; i += 5) {
        if (i !== 0) {
            buildingObjects.push({
                x: centerX + i,
                y: centerY - 3,
                emoji: '🏮',
                name: 'Lamp Post',
                type: 'decoration',
            })
            buildingObjects.push({
                x: centerX - 3,
                y: centerY + i,
                emoji: '🏮',
                name: 'Lamp Post',
                type: 'decoration',
            })
        }
    }

    // 10. Add trees in organized pattern around quad
    const treePositions = [
        // Corner trees
        { x: centerX - 15, y: centerY - 15 },
        { x: centerX + 15, y: centerY - 15 },
        { x: centerX - 15, y: centerY + 15 },
        { x: centerX + 15, y: centerY + 15 },
        // Mid trees
        { x: centerX - 10, y: centerY - 5 },
        { x: centerX + 10, y: centerY - 5 },
        { x: centerX - 10, y: centerY + 5 },
        { x: centerX + 10, y: centerY + 5 },
    ]
    treePositions.forEach(pos => {
        if (pos.y >= 0 && pos.y < height && pos.x >= 0 && pos.x < width) {
            if (grid[pos.y][pos.x] === TILES.GRASS) {
                grid[pos.y][pos.x] = TILES.TREE
            }
        }
    })

    // 11. Add small pond in corner of quad
    const pondX = centerX + 8
    const pondY = centerY - 8
    for (let dy = 0; dy < 4; dy++) {
        for (let dx = 0; dx < 5; dx++) {
            const px = pondX + dx
            const py = pondY + dy
            if (py >= 0 && py < height && px >= 0 && px < width) {
                if (grid[py][px] === TILES.GRASS) {
                    grid[py][px] = TILES.WATER
                }
            }
        }
    }
    buildingObjects.push({
        x: pondX + 2,
        y: pondY + 2,
        emoji: '🦆',
        name: 'Duck Pond',
        type: 'decoration',
    })

    // 12. Ensure spawn area is clear
    for (let y = centerY - 2; y <= centerY + 2; y++) {
        for (let x = centerX - 2; x <= centerX + 2; x++) {
            if (y >= 0 && y < height && x >= 0 && x < width) {
                if (grid[y][x] === TILES.TREE) {
                    grid[y][x] = TILES.GRASS
                }
            }
        }
    }

    // Store building objects for later rendering
    generatedBuildingObjects = buildingObjects

    // Log door positions for debugging
    console.log('Generated building doors:', doorPositions)
    console.log('Building objects:', buildingObjects.length)

    return grid
}

// Store generated building objects
let generatedBuildingObjects = []

// Get building objects for rendering
export const getBuildingObjects = () => generatedBuildingObjects

// Export door positions for use by other modules
export const getBuildingDoorPositions = (centerX, centerY) => {
    const positions = {}
    Object.entries(BUILDINGS).forEach(([name, building]) => {
        const startX = centerX + building.relX
        const startY = centerY + building.relY
        const doorX = startX + building.doorOffsetX
        const doorY = startY + building.height - 1
        positions[name] = { x: doorX, y: doorY }
    })
    return positions
}
