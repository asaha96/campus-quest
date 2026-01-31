import { useMemo } from 'react'
import {
  SPRITE_SIZE,
  CHARACTER_SPRITES,
  getSpriteFrame,
  generatePlaceholderSprite,
} from '../../data/spritesheet'
import useSpriteAnimation from '../../hooks/useSpriteAnimation'

// Player sprite component with walk cycle animation
// Uses CSS sprite extraction pattern for PNG sprites
// Falls back to CSS-generated pixel art when PNG not available

export default function CharacterSprite({
  characterId = 'player',
  direction = 'down',
  isMoving = false,
  scale = 1,
  className = '',
}) {
  const { frame, offset } = useSpriteAnimation(isMoving)
  const character = CHARACTER_SPRITES[characterId] || CHARACTER_SPRITES.player

  // Calculate sprite position for current frame
  const spritePosition = useMemo(() => {
    return getSpriteFrame(direction, frame, isMoving ? 'walk' : 'idle')
  }, [direction, frame, isMoving])

  // Generate fallback CSS sprite
  const fallbackSprite = useMemo(() => {
    return generatePlaceholderSprite(character.colors, direction, frame)
  }, [character.colors, direction, frame])

  // Determine if we should try to load the PNG sprite
  // For now, always use fallback since we don't have actual PNGs
  const useFallback = true

  if (useFallback) {
    return (
      <div
        className={`relative ${className}`}
        style={{
          width: SPRITE_SIZE * scale,
          height: SPRITE_SIZE * scale,
          transform: `translateY(${offset.y * scale}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* CSS-generated pixel art sprite */}
        <div
          style={{
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            background: fallbackSprite,
            imageRendering: 'pixelated',
            filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))',
          }}
        />
      </div>
    )
  }

  // PNG sprite sheet version (when available)
  return (
    <div
      className={`relative ${className}`}
      style={{
        width: SPRITE_SIZE * scale,
        height: SPRITE_SIZE * scale,
        transform: `translateY(${offset.y * scale}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div
        style={{
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          backgroundImage: `url(${character.sheetUrl})`,
          backgroundPosition: `${spritePosition.x}px ${spritePosition.y}px`,
          imageRendering: 'pixelated',
          filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))',
        }}
      />
    </div>
  )
}

// Compact version for UI elements (portraits, inventory, etc.)
export function CharacterPortrait({
  characterId = 'player',
  size = 48,
  className = '',
}) {
  const character = CHARACTER_SPRITES[characterId] || CHARACTER_SPRITES.player
  const fallbackSprite = generatePlaceholderSprite(character.colors, 'down', 0)

  return (
    <div
      className={`rounded-lg overflow-hidden border-2 border-gba-path ${className}`}
      style={{
        width: size,
        height: size,
        background: `#1a1a2e`,
      }}
    >
      <div
        style={{
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          transform: `scale(${size / SPRITE_SIZE})`,
          transformOrigin: 'top left',
          background: fallbackSprite,
          imageRendering: 'pixelated',
        }}
      />
    </div>
  )
}
