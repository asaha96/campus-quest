import { useMemo } from 'react'
import {
  SPRITE_SIZE,
  CHARACTER_SPRITES,
  NPC_SPRITE_MAP,
  generatePlaceholderSprite,
} from '../../data/spritesheet'
import { useIdleAnimation, useTalkAnimation } from '../../hooks/useSpriteAnimation'

// NPC sprite component with idle animations
// Supports talk animation when in dialogue

export default function NPCSprite({
  npcName,
  spriteId,
  direction = 'down',
  isTalking = false,
  scale = 1,
  className = '',
}) {
  // Resolve sprite ID from NPC name if not provided
  const resolvedSpriteId = spriteId || NPC_SPRITE_MAP[npcName] || 'player'
  const character = CHARACTER_SPRITES[resolvedSpriteId] || CHARACTER_SPRITES.player

  // Use talk animation if talking, otherwise idle animation
  const idleFrame = useIdleAnimation(500)
  const talkFrame = useTalkAnimation(isTalking)
  const frame = isTalking ? talkFrame : idleFrame

  // Generate CSS sprite with slight animation variation
  const fallbackSprite = useMemo(() => {
    return generatePlaceholderSprite(character.colors, direction, frame)
  }, [character.colors, direction, frame])

  // Subtle idle animation (breathing/bobbing effect)
  const idleOffset = useMemo(() => {
    return frame === 1 ? -1 : 0
  }, [frame])

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: SPRITE_SIZE * scale,
        height: SPRITE_SIZE * scale,
        transform: `translateY(${idleOffset * scale}px)`,
        transition: 'transform 0.2s ease-out',
      }}
    >
      <div
        style={{
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          background: fallbackSprite,
          imageRendering: 'pixelated',
          filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.4))',
        }}
      />

      {/* Talk indicator when in dialogue */}
      {isTalking && (
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce"
          style={{ fontSize: '12px' }}
        >
          ...
        </div>
      )}
    </div>
  )
}

// Interactable object sprite (for furniture, items, etc.)
export function ObjectSprite({
  type,
  emoji,
  scale = 1,
  isHighlighted = false,
  className = '',
}) {
  // Simple object rendering with optional highlight
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width: SPRITE_SIZE * scale,
        height: SPRITE_SIZE * scale,
        transition: 'all 0.2s ease-out',
        filter: isHighlighted
          ? 'drop-shadow(0 0 4px rgba(255, 255, 100, 0.8))'
          : 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))',
        transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      <span
        style={{
          fontSize: `${20 * scale}px`,
          imageRendering: 'pixelated',
        }}
      >
        {emoji}
      </span>
    </div>
  )
}

// Preview sprite for UI elements (menus, selection screens)
export function NPCPreview({
  npcName,
  spriteId,
  size = 64,
  showName = true,
  className = '',
}) {
  const resolvedSpriteId = spriteId || NPC_SPRITE_MAP[npcName] || 'player'
  const character = CHARACTER_SPRITES[resolvedSpriteId] || CHARACTER_SPRITES.player
  const fallbackSprite = generatePlaceholderSprite(character.colors, 'down', 0)

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="rounded-lg border-2 border-gba-path bg-gba-dark/50"
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            transform: `scale(${(size - 8) / SPRITE_SIZE})`,
            background: fallbackSprite,
            imageRendering: 'pixelated',
          }}
        />
      </div>
      {showName && (
        <span className="mt-1 text-[8px] text-gba-light/70">
          {character.name || npcName}
        </span>
      )}
    </div>
  )
}
