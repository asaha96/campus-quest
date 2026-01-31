import { memo } from 'react'
import { useSelector } from 'react-redux'
import { TILE_SIZE } from '../../data/maps'
import { getZone } from '../../data/zones'
import NPCSprite, { ObjectSprite } from '../Sprites/NPCSprite'

// Render NPCs in the current zone using pixel art sprites
const NPC = memo(({ npc, offset }) => {
  return (
    <div
      className="absolute z-15 flex items-center justify-center"
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        left: (npc.x - offset.x) * TILE_SIZE,
        top: (npc.y - offset.y) * TILE_SIZE,
      }}
    >
      <NPCSprite
        npcName={npc.name}
        direction="down"
        scale={1}
      />
    </div>
  )
})

// Render interactable objects in the current zone
const Interactable = memo(({ obj, offset }) => {
  return (
    <div
      className="absolute z-10 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
        left: (obj.x - offset.x) * TILE_SIZE,
        top: (obj.y - offset.y) * TILE_SIZE,
      }}
    >
      <ObjectSprite
        type={obj.type}
        emoji={obj.emoji}
        scale={1}
      />
    </div>
  )
})

export default function ZoneObjects({ offset = { x: 0, y: 0 } }) {
  const mapState = useSelector((state) => state.map || {})
  const currentZone = mapState.currentZone || 'campus'
  const zone = getZone(currentZone)

  // Only render objects for interior zones (campus objects are handled differently)
  if (!zone || zone.isExterior) {
    return null
  }

  const npcs = zone.npcs || []
  const interactables = zone.interactables || []

  return (
    <>
      {/* Render interactables first (lower z-index) */}
      {interactables.map((obj) => (
        <Interactable key={`${obj.x}-${obj.y}`} obj={obj} offset={offset} />
      ))}

      {/* Render NPCs on top */}
      {npcs.map((npc) => (
        <NPC key={`${npc.x}-${npc.y}`} npc={npc} offset={offset} />
      ))}
    </>
  )
}
