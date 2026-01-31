import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, addXp, showToast } from '../../features/gameStateSlice'
import { getBoss, calculateDamage, shouldUseSpecial } from '../../data/bosses'

export default function BattleModal({ onClose, bossType = 'GYM' }) {
    const dispatch = useDispatch()
    const gameState = useSelector(state => state.gameState || {})
    const xp = gameState.xp || 0

    // Get boss configuration
    const boss = getBoss(bossType)

    // Battle state
    const [playerHealth, setPlayerHealth] = useState(100)
    const [enemyHealth, setEnemyHealth] = useState(boss.hp)
    const [battleLog, setBattleLog] = useState([`${boss.emoji} ${boss.name} appeared! "${boss.dialogue.intro}"`])
    const [isPlayerTurn, setIsPlayerTurn] = useState(true)
    const [battleOver, setBattleOver] = useState(false)
    const [showSpecialEffect, setShowSpecialEffect] = useState(false)

    const addToLog = (message) => {
        setBattleLog(prev => [...prev.slice(-3), message])
    }

    const handleAttack = () => {
        if (!isPlayerTurn || battleOver) return

        const damage = Math.floor(Math.random() * 15) + 10
        setEnemyHealth(prev => Math.max(0, prev - damage))
        addToLog(`You attacked for ${damage} damage!`)
        setIsPlayerTurn(false)
    }

    const handleHeal = () => {
        if (!isPlayerTurn || battleOver) return

        const heal = Math.floor(Math.random() * 10) + 10
        setPlayerHealth(prev => Math.min(100, prev + heal))
        addToLog(`You healed for ${heal} HP!`)
        setIsPlayerTurn(false)
    }

    const handleDefend = () => {
        if (!isPlayerTurn || battleOver) return

        addToLog('You brace yourself for the attack!')
        setIsPlayerTurn(false)
    }

    // Enemy turn logic
    useEffect(() => {
        if (!isPlayerTurn && !battleOver) {
            if (enemyHealth <= 0) return // Wait for victory effect

            const timer = setTimeout(() => {
                const useSpecial = shouldUseSpecial(boss)
                let damage
                let attackMessage

                if (useSpecial && boss.specialAbility) {
                    // Special attack
                    damage = calculateDamage(
                        boss.specialAbility.damage.min,
                        boss.specialAbility.damage.max
                    )
                    attackMessage = `${boss.emoji} ${boss.name} used ${boss.specialAbility.name}! "${boss.dialogue.special}" (${damage} damage!)`
                    setShowSpecialEffect(true)
                    setTimeout(() => setShowSpecialEffect(false), 500)
                } else {
                    // Normal attack
                    damage = calculateDamage(boss.damage.min, boss.damage.max)
                    attackMessage = `${boss.emoji} ${boss.name}: "${boss.dialogue.attack}" (${damage} damage)`
                }

                setPlayerHealth(prev => Math.max(0, prev - damage))
                addToLog(attackMessage)
                setIsPlayerTurn(true)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [isPlayerTurn, battleOver, enemyHealth, boss])

    // Win/Loss check
    useEffect(() => {
        if (playerHealth <= 0 && !battleOver) {
            setBattleOver(true)
            addToLog(`${boss.emoji} "${boss.dialogue.victory}"`)
        } else if (enemyHealth <= 0 && !battleOver) {
            setBattleOver(true)
            addToLog(`${boss.emoji} "${boss.dialogue.defeat}" You won! +${boss.xpReward} XP!`)
            dispatch(addXp(boss.xpReward))
            dispatch(showToast(`Victory! +${boss.xpReward} XP`))
        }
    }, [playerHealth, enemyHealth, battleOver, dispatch, boss])


    // Get color classes based on boss type
    const colorClasses = {
        blue: { bg: 'bg-blue-100', hover: 'hover:bg-blue-200', border: 'border-blue-300' },
        red: { bg: 'bg-red-100', hover: 'hover:bg-red-200', border: 'border-red-300' },
        amber: { bg: 'bg-amber-100', hover: 'hover:bg-amber-200', border: 'border-amber-300' },
        purple: { bg: 'bg-purple-100', hover: 'hover:bg-purple-200', border: 'border-purple-300' },
    }
    const bossColors = colorClasses[boss.color] || colorClasses.red

    return (
        <div className="flex flex-col gap-4 text-gba-dark">
            <h2 className={`text-xl font-bold text-center border-b-2 border-gba-dark pb-2`}>
                {boss.emoji} {boss.name}
            </h2>

            {/* Special effect overlay */}
            {showSpecialEffect && (
                <div className="absolute inset-0 bg-yellow-400/30 animate-pulse rounded-lg pointer-events-none z-10" />
            )}

            {/* Battle Status */}
            <div className="flex justify-between items-center gap-4">
                <div className="flex-1 bg-white p-2 rounded shadow border border-gba-path">
                    <div className="font-bold">You</div>
                    <div className="w-full bg-gray-200 h-2 mt-1 rounded">
                        <div
                            className="bg-green-500 h-full rounded transition-all duration-500"
                            style={{ width: `${playerHealth}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-right">{playerHealth}/100</div>
                </div>
                <div className="text-2xl font-bold">VS</div>
                <div className="flex-1 bg-white p-2 rounded shadow border border-gba-path text-right">
                    <div className="font-bold">{boss.name}</div>
                    <div className="w-full bg-gray-200 h-2 mt-1 rounded">
                        <div
                            className="bg-red-500 h-full rounded transition-all duration-500"
                            style={{ width: `${(enemyHealth / boss.hp) * 100}%` }}
                        ></div>
                    </div>
                    <div className="text-xs">{enemyHealth}/{boss.hp}</div>
                </div>
            </div>

            {/* Battle Visualization */}
            <div className={`h-32 ${bossColors.bg} rounded flex items-center justify-center border ${bossColors.border} relative overflow-hidden`}>
                <div className="flex gap-8 items-end">
                    <span className="text-4xl animate-bounce">🧑‍🎓</span>
                    <span className={`text-5xl ${showSpecialEffect ? 'animate-ping' : 'animate-pulse'}`}>
                        {boss.emoji}
                    </span>
                </div>
            </div>

            {/* Battle Log */}
            <div className="min-h-[80px] bg-white p-2 rounded border border-gba-path text-sm font-mono overflow-y-auto max-h-24">
                {battleLog.map((log, i) => (
                    <div key={i} className={i === battleLog.length - 1 ? 'font-bold' : 'opacity-70'}>
                        {log}
                    </div>
                ))}
            </div>

            {/* Actions */}
            {!battleOver ? (
                <div className="grid grid-cols-3 gap-2 mt-2">
                    <button
                        onClick={handleAttack}
                        disabled={!isPlayerTurn}
                        className="p-3 bg-red-100 hover:bg-red-200 border-2 border-red-300 rounded font-bold disabled:opacity-50 text-sm"
                    >
                        👊 Attack
                    </button>
                    <button
                        onClick={handleHeal}
                        disabled={!isPlayerTurn}
                        className="p-3 bg-green-100 hover:bg-green-200 border-2 border-green-300 rounded font-bold disabled:opacity-50 text-sm"
                    >
                        💊 Heal
                    </button>
                    <button
                        onClick={handleDefend}
                        disabled={!isPlayerTurn}
                        className="p-3 bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded font-bold disabled:opacity-50 text-sm"
                    >
                        🛡️ Defend
                    </button>
                    <button
                        onClick={() => onClose()}
                        className="col-span-3 p-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                        🏃 Run Away
                    </button>
                </div>
            ) : (
                <button
                    onClick={onClose}
                    className={`w-full p-3 ${bossColors.bg} ${bossColors.hover} border-2 ${bossColors.border} rounded font-bold mt-2`}
                >
                    {playerHealth > 0 ? `Collect ${boss.xpReward} XP & Leave` : "Retreat"}
                </button>
            )}
        </div>
    )
}
