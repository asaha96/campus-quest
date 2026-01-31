import { useSelector } from 'react-redux'
import { sprites, wildSprites, getSpriteById } from '../../data/sprites'
import { Users, Heart, Swords, Shield, Zap } from 'lucide-react'

export default function TeamView({ onClose }) {
  const gameState = useSelector((state) => state.gameState || {})
  const spriteBattle = useSelector((state) => state.spriteBattle || {})

  // Safely destructure with defaults
  const collectedSprites = gameState.collectedSprites || []
  const caughtSprites = spriteBattle.caughtSprites || []

  // Combine collected sprites (from activities) and caught sprites (from battles)
  const allCollectedIds = [...new Set([...collectedSprites, ...caughtSprites])]

  // Get sprite data for all collected
  const collectedSpriteData = allCollectedIds
    .map((id) => getSpriteById(id))
    .filter(Boolean)
    .sort((a, b) => a.id - b.id)

  const totalSprites = sprites.length + wildSprites.length

  return (
    <div className="text-center max-h-[70vh] overflow-hidden">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Users size={24} className="text-purple-400" />
        <h2 className="text-sm font-bold text-gba-light">Your Sprite Team</h2>
      </div>

      <p className="text-[10px] text-gba-light/70 mb-4">
        {collectedSpriteData.length}/{totalSprites} sprites collected
      </p>

      {collectedSpriteData.length === 0 ? (
        <div className="bg-gba-wall/20 rounded-lg p-6 mb-4">
          <p className="text-4xl mb-3">🎭</p>
          <p className="text-xs text-gba-light/60">
            No sprites yet! Complete activities or catch wild sprites.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
          {collectedSpriteData.map((sprite, index) => (
            <div
              key={sprite.id}
              className={`bg-gba-wall/20 rounded-lg p-3 border ${
                index === 0 ? 'border-yellow-500/50' : 'border-gba-path/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Sprite icon */}
                <div className="text-3xl flex-shrink-0">{sprite.emoji}</div>

                {/* Sprite info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gba-light">
                      {sprite.name}
                    </span>
                    {index === 0 && (
                      <span className="text-[8px] bg-yellow-500/30 text-yellow-400 px-1 rounded">
                        ACTIVE
                      </span>
                    )}
                    <span className="text-[8px] text-gba-light/50">
                      {sprite.type}
                    </span>
                  </div>

                  <p className="text-[8px] text-gba-light/60 mb-2">
                    {sprite.description}
                  </p>

                  {/* Stats */}
                  {sprite.stats && (
                    <div className="grid grid-cols-4 gap-1 text-[8px]">
                      <div className="flex items-center gap-1 text-red-400">
                        <Heart size={10} />
                        {sprite.stats.hp}
                      </div>
                      <div className="flex items-center gap-1 text-orange-400">
                        <Swords size={10} />
                        {sprite.stats.attack}
                      </div>
                      <div className="flex items-center gap-1 text-blue-400">
                        <Shield size={10} />
                        {sprite.stats.defense}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Zap size={10} />
                        {sprite.stats.speed}
                      </div>
                    </div>
                  )}

                  {/* Moves */}
                  {sprite.moves && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {sprite.moves.map((move) => (
                        <span
                          key={move.name}
                          className={`text-[7px] px-1 rounded ${
                            move.type === 'heal'
                              ? 'bg-green-600/30 text-green-400'
                              : 'bg-red-600/30 text-red-400'
                          }`}
                        >
                          {move.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2 justify-center">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gba-path text-gba-dark rounded-lg transition-colors text-xs hover:bg-gba-path/80"
        >
          Close
        </button>
      </div>

      <p className="mt-3 text-[8px] text-gba-light/40">
        Tip: The first sprite in your team is used in battles!
      </p>
    </div>
  )
}
