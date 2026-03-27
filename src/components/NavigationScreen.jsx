import useHospitalNavigation, { getPalette } from '../hooks/useHospitalNavigation'
import { FONTS } from '../styles/theme'

const sans = FONTS.sans
import { FLOORS } from '../data/hospitalMap'
import DocumentOverlay from './DocumentOverlay'

const CHAR_SCALE = 1.6
const CHAR_W = 24 * CHAR_SCALE
const CHAR_H = 36 * CHAR_SCALE
const GROUND_Y = 200
const CHAR_Y = GROUND_Y - CHAR_H + 8
const DOOR_BOTTOM = GROUND_Y - 10
const INTERACT_RANGE = 55

// ─── SVG 캐릭터 ──────────────────────────────────────────────────
function PixelChar({ facing = 'right', walking = false, frame = 0, isPlayer = false, color = '#e8dcc0' }) {
  const legOff = walking ? [0, 2, 0, -2][frame % 4] : 0
  const coatColor = isPlayer ? '#f5f2eb' : '#f0ede6'
  return (
    <svg width={CHAR_W} height={CHAR_H} viewBox="0 0 24 36"
      style={{ transform: `scaleX(${facing === 'left' ? -1 : 1})`, display: 'block' }}>
      <ellipse cx="12" cy="35" rx="8" ry="2" fill="rgba(0,0,0,0.12)" />
      <rect x="8" y={26 + legOff} width="3" height="8" rx="1" fill="#5a6a7a" />
      <rect x="13" y={26 - legOff} width="3" height="8" rx="1" fill="#4a5a6a" />
      <rect x="6" y="14" width="12" height="14" rx="2" fill={coatColor} />
      {isPlayer && <rect x="7" y="15" width="10" height="3" rx="1" fill="rgba(80,120,180,0.15)" />}
      <rect x="3" y={16 + legOff} width="4" height="10" rx="2" fill={coatColor} />
      <rect x="17" y={16 - legOff} width="4" height="10" rx="2" fill={coatColor} />
      <circle cx="12" cy="10" r="6" fill={isPlayer ? '#f0e0d0' : color} />
      <ellipse cx="12" cy="7" rx="6" ry="4" fill={isPlayer ? '#5a4a3a' : '#6a5a4a'} />
      <rect x="9" y="9" width="2" height="2" rx="0.5" fill="#3a3a3a" />
      <rect x="13" y="9" width="2" height="2" rx="0.5" fill="#3a3a3a" />
    </svg>
  )
}

// ─── 계단 ────────────────────────────────────────────────────────
function StairsIcon({ direction, palette }) {
  return (
    <div style={{ position: 'absolute', top: direction === 'up' ? 40 : 60, width: 60, height: 100 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: direction === 'up' ? i * 16 : (4 - i) * 16,
          left: direction === 'up' ? i * 6 : (4 - i) * 6,
          width: 40 - i * 2, height: 14,
          background: `linear-gradient(180deg, ${palette.wainscot} 0%, ${palette.doorFrame} 100%)`,
          borderRadius: '2px 2px 0 0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }} />
      ))}
      <div style={{
        position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)',
        fontSize: 10, color: palette.textSecondary, whiteSpace: 'nowrap',
        fontFamily: sans, fontWeight: 500, letterSpacing: 0.5,
      }}>
        {direction === 'up' ? '▲ 위층' : '▼ 아래층'}
      </div>
    </div>
  )
}

// ─── 메인 컴포넌트 ───────────────────────────────────────────────
export default function NavigationScreen({ timeOfDay, onEnterClinic, onComplete, professorRelationLevel = 'neutral', nurseRelationLevel = 'neutral', initialDialogue = null, onInitialDialogueSeen = null, pendingDocument = null, onDocumentSeen = null, guided = false, pendingRumor = null, onRumorSeen = null }) {
  const nav = useHospitalNavigation({ timeOfDay, onEnterClinic, onComplete, professorRelationLevel, nurseRelationLevel, initialDialogue, onInitialDialogueSeen, guided, pendingRumor, onRumorSeen })
  const {
    currentFloor, playerX, facing, walking, walkFrame,
    activeDialogue, roomDescription, dialogueVisible,
    floorTransition, roomPrompt,
    closeDialogue, handleNPCClick,
    seniorGuidePos, tourComplete,
  } = nav

  const palette = getPalette(timeOfDay)
  const floor = FLOORS[currentFloor]
  const viewportWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth, 800) : 800
  const cameraX = Math.max(0, Math.min(floor.width - viewportWidth, playerX - viewportWidth / 2))

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: '#1A1815', fontFamily: sans, userSelect: 'none',
    }}>
      {/* HUD */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 20px', background: '#1A1815',
        borderBottom: '1px solid rgba(200,180,140,0.12)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, color: '#8A8580', letterSpacing: 1 }}>
          {timeOfDay === 'morning' ? '오전 8:42' : '오후 6:18'}
        </span>
        <span style={{ fontSize: 13, color: '#E8E0D0', fontWeight: 500, letterSpacing: 2 }}>
          {floor.label}
        </span>
        {(!guided || tourComplete) && (
          <button onClick={onComplete} style={{
            background: 'transparent', border: '1px solid rgba(200,180,140,0.2)',
            color: '#8A8580', padding: '3px 10px', borderRadius: 4,
            fontSize: 11, cursor: 'pointer',
          }}>
            {timeOfDay === 'morning' ? '건너뛰기' : '퇴근하기'}
          </button>
        )}
        {guided && !tourComplete && (
          <span style={{ fontSize: 10, color: '#6a5a40', letterSpacing: 0.5 }}>선배를 따라가세요</span>
        )}
      </div>

      {/* 층 인디케이터 */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8, padding: '6px 0',
        background: '#1A1815', flexShrink: 0,
      }}>
        {[3, 2, 1].map(f => (
          <div key={f} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: f === currentFloor ? palette.wainscot : 'rgba(200,180,140,0.15)',
            transition: 'background 0.3s',
            boxShadow: f === currentFloor ? `0 0 8px ${palette.wainscot}40` : 'none',
          }} />
        ))}
      </div>

      {/* 뷰포트 */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        margin: '0 auto', width: viewportWidth, background: palette.ceilingTile,
      }} tabIndex={0}>

        {/* 층 전환 페이드 */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50, background: '#1A1815',
          opacity: floorTransition ? 1 : 0, transition: 'opacity 0.25s ease',
          pointerEvents: floorTransition ? 'all' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {floorTransition && (
            <span style={{ color: '#8A8580', fontSize: 13, letterSpacing: 2 }}>
              {floorTransition === 'up' ? '▲' : '▼'}
            </span>
          )}
        </div>

        {/* 스크롤 레이어 */}
        <div style={{
          position: 'absolute', width: floor.width, height: '100%',
          transform: `translateX(${-cameraX}px)`,
        }}>
          {/* 천장 */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40, background: palette.ceilingTile }}>
            {Array.from({ length: Math.ceil(floor.width / 80) }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute', left: i * 80, top: 0, width: 1, height: 40,
                background: palette.ceilingLine,
              }} />
            ))}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 20, height: 1, background: palette.ceilingLine }} />
          </div>

          {/* 조명 */}
          {Array.from({ length: Math.ceil(floor.width / 180) }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', left: i * 180 + 70, top: 36, width: 40, height: 6,
              background: timeOfDay === 'morning' ? '#f8f0d0' : '#a89870',
              borderRadius: '0 0 4px 4px',
              boxShadow: timeOfDay === 'morning'
                ? '0 2px 20px rgba(255,230,150,0.5)' : '0 2px 8px rgba(180,160,120,0.15)',
            }} />
          ))}

          {/* 벽 */}
          <div style={{
            position: 'absolute', top: 40, left: 0, right: 0, height: 100,
            background: `linear-gradient(180deg, ${palette.wallTop} 0%, ${palette.wall} 100%)`,
          }} />

          {/* 창문 */}
          {Array.from({ length: Math.ceil(floor.width / 220) }).map((_, i) => {
            const wx = i * 220 + 40
            if (floor.rooms.some(r => Math.abs(wx - r.x) < 90)) return null
            return (
              <div key={i} style={{
                position: 'absolute', left: wx, top: 52, width: 50, height: 65,
                background: timeOfDay === 'morning'
                  ? 'linear-gradient(180deg, #f8e8a0, #e8cc70)'
                  : 'linear-gradient(180deg, #4a5a70, #3a4a60)',
                border: `3px solid ${palette.wainscot}`, borderRadius: 2,
                boxShadow: timeOfDay === 'morning' ? `0 0 30px ${palette.windowLight}` : 'none',
              }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: palette.wainscot }} />
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: palette.wainscot }} />
              </div>
            )
          })}

          {/* 웨인스코팅 */}
          <div style={{
            position: 'absolute', top: 132, left: 0, right: 0, height: 8,
            background: palette.wainscot, boxShadow: '0 2px 3px rgba(0,0,0,0.08)',
          }} />

          {/* 저녁: 출구 표시 (1층 왼쪽 끝) */}
          {timeOfDay === 'evening' && currentFloor === 1 && (
            <div style={{
              position: 'absolute', left: 0, top: 40, width: 30,
              height: GROUND_Y - 40, background: 'rgba(100,80,50,0.15)',
              borderRight: `1px solid ${palette.wainscot}40`,
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              paddingTop: 8,
            }}>
              <span style={{ fontSize: 9, color: palette.textSecondary, writingMode: 'vertical-rl' }}>출구</span>
            </div>
          )}

          {/* 시설물 */}
          {floor.rooms.map(room => {
            const doorH = 110
            const doorTop = DOOR_BOTTOM - doorH
            const isNear = Math.abs(playerX - (room.x + room.width / 2)) < INTERACT_RANGE + 10
            return (
              <div key={room.id} style={{
                position: 'absolute', left: room.x, top: doorTop,
                width: room.width, height: doorH,
                cursor: isNear ? 'pointer' : 'default',
              }} onClick={() => {
                if (isNear && !activeDialogue && !roomDescription && !floorTransition) {
                  if (timeOfDay === 'morning' && (room.id === 'clinic1' || room.id === 'clinic2')) {
                    onEnterClinic?.()
                  } else {
                    // handled by key handler / openRoom via ref
                  }
                }
              }}>
                {room.type === 'door' && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: palette.doorFrame, borderRadius: '3px 3px 0 0', padding: 3,
                  }}>
                    <div style={{
                      width: '100%', height: '100%',
                      background: `linear-gradient(180deg, ${palette.doorFill}, ${palette.doorDark})`,
                      borderRadius: '2px 2px 0 0', position: 'relative',
                    }}>
                      <div style={{ position: 'absolute', top: 10, left: 8, right: 8, height: 34, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 1 }} />
                      <div style={{ position: 'absolute', top: 52, left: 8, right: 8, bottom: 8, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 1 }} />
                      <div style={{
                        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#d4a855', boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      }} />
                    </div>
                  </div>
                )}
                {room.type === 'vending' && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 94,
                    background: 'linear-gradient(180deg, #3a3a3a, #2a2a2a)',
                    borderRadius: 3, border: '2px solid #4a4a4a',
                  }}>
                    <div style={{
                      position: 'absolute', top: 6, left: 5, right: 5, height: 44,
                      background: 'linear-gradient(180deg, #2a5a4a, #1a4a3a)',
                      borderRadius: 2, display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 1fr)',
                      gap: 2, padding: 3,
                    }}>
                      {Array.from({ length: 12 }).map((_, j) => (
                        <div key={j} style={{
                          background: ['#e85040','#40a0e0','#e8c040','#60c060','#e87040','#a060c0'][j % 6],
                          borderRadius: 1, opacity: 0.8,
                        }} />
                      ))}
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 8, left: 5, right: 5, height: 26,
                      background: '#1a1a1a', borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, color: '#666',
                    }}>₩300</div>
                  </div>
                )}
                {room.type === 'counter' && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 52,
                    background: `linear-gradient(180deg, ${palette.wainscot}, ${palette.doorFrame})`,
                    borderRadius: '3px 3px 0 0',
                  }}>
                    {[12, 52].map(left => (
                      <div key={left} style={{
                        position: 'absolute', top: -32, left, width: 24, height: 20,
                        background: '#2a3a4a', borderRadius: 2, border: '1px solid #4a5a6a',
                      }}>
                        <div style={{ position: 'absolute', inset: 2, background: timeOfDay === 'morning' ? '#a0c0e0' : '#304050', borderRadius: 1 }} />
                      </div>
                    ))}
                    <div style={{
                      position: 'absolute', top: -10, right: 10, width: 16, height: 20,
                      background: '#f0e8d0', borderRadius: 1, transform: 'rotate(-5deg)',
                    }} />
                  </div>
                )}
                <div style={{
                  position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)',
                  fontSize: 10, color: palette.textSecondary, whiteSpace: 'nowrap', fontWeight: 500,
                }}>
                  {room.name}
                  {room.sub && <span style={{ fontSize: 9, opacity: 0.6 }}> · {room.sub}</span>}
                </div>
              </div>
            )
          })}

          {/* 장식물 */}
          {floor.decorations.map((d, i) => {
            if (d.type === 'plant') return (
              <div key={i} style={{ position: 'absolute', left: d.x, top: GROUND_Y - 36 }}>
                <div style={{ width: 22, height: 15, background: '#b07040', borderRadius: '0 0 4px 4px', margin: '0 auto' }} />
                <div style={{ position: 'absolute', top: -18, left: 2, width: 18, height: 20 }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 4, width: 12, height: 16, background: '#6a9a50', borderRadius: '50% 50% 0 0' }} />
                  <div style={{ position: 'absolute', bottom: 4, left: -2, width: 12, height: 12, background: '#5a8a40', borderRadius: '50%', opacity: 0.8 }} />
                  <div style={{ position: 'absolute', bottom: 4, right: -2, width: 12, height: 12, background: '#7aaa60', borderRadius: '50%', opacity: 0.8 }} />
                </div>
              </div>
            )
            if (d.type === 'bench') return (
              <div key={i} style={{
                position: 'absolute', left: d.x, top: GROUND_Y - 18,
                width: 52, height: 14,
                background: `linear-gradient(180deg, ${palette.wainscot}, ${palette.doorFrame})`,
                borderRadius: 2,
              }}>
                <div style={{ position: 'absolute', left: 4, bottom: -10, width: 5, height: 10, background: palette.doorFrame }} />
                <div style={{ position: 'absolute', right: 4, bottom: -10, width: 5, height: 10, background: palette.doorFrame }} />
              </div>
            )
            if (d.type === 'board') return (
              <div key={i} style={{
                position: 'absolute', left: d.x, top: 62, width: 52, height: 38,
                background: '#b09060', borderRadius: 2, border: `2px solid ${palette.wainscot}`, padding: 3,
              }}>
                <div style={{ width: 14, height: 9, background: '#f0e8d0', borderRadius: 1, margin: 1 }} />
                <div style={{ width: 18, height: 9, background: '#d8e8f0', borderRadius: 1, margin: 1 }} />
                <div style={{ width: 12, height: 9, background: '#f0d8d0', borderRadius: 1, margin: 1 }} />
              </div>
            )
            return null
          })}

          {/* 계단 */}
          {floor.stairs && (
            <div style={{ position: 'absolute', left: floor.stairs.x }}>
              <StairsIcon direction="up" palette={palette} />
            </div>
          )}
          {floor.stairsUp && (
            <div style={{ position: 'absolute', left: floor.stairsUp.x }}>
              <StairsIcon direction="up" palette={palette} />
            </div>
          )}
          {floor.stairsDown && (
            <div style={{ position: 'absolute', left: floor.stairsDown.x }}>
              <StairsIcon direction="down" palette={palette} />
            </div>
          )}

          {/* 바닥 */}
          <div style={{
            position: 'absolute', top: GROUND_Y, left: 0, right: 0, height: 120,
            background: `linear-gradient(180deg, ${palette.floorTop}, ${palette.floor})`,
          }}>
            {Array.from({ length: Math.ceil(floor.width / 60) }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute', left: i * 60, top: 0, width: 1, height: '100%',
                background: 'rgba(0,0,0,0.04)',
              }} />
            ))}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 16,
              background: `linear-gradient(180deg, ${palette.floorShine}, transparent)`,
            }} />
          </div>

          {/* 빛 기둥 (오전) */}
          {timeOfDay === 'morning' && Array.from({ length: Math.ceil(floor.width / 220) }).map((_, i) => {
            const wx = i * 220 + 40
            if (floor.rooms.some(r => Math.abs(wx - r.x) < 90)) return null
            return (
              <div key={i} style={{
                position: 'absolute', left: wx - 10, top: 117, width: 80, height: 200,
                background: 'linear-gradient(180deg, rgba(255,230,150,0.1), rgba(255,230,150,0.01))',
                transform: 'skewX(-8deg)', pointerEvents: 'none',
              }} />
            )
          })}

          {/* 가이드 선배 (guided 모드, 현재 층에 있을 때) */}
          {guided && seniorGuidePos && currentFloor === seniorGuidePos.floor && (
            <div style={{
              position: 'absolute', left: seniorGuidePos.x - CHAR_W / 2, top: CHAR_Y + 10, zIndex: 10,
            }}>
              <PixelChar
                facing={seniorGuidePos.x > playerX ? 'left' : 'right'}
                color="#e0d8c0"
              />
              <div style={{
                textAlign: 'center', fontSize: 10, marginTop: 0,
                color: '#c4a870', fontWeight: 600, whiteSpace: 'nowrap',
              }}>박 선배</div>
              {!activeDialogue && !roomDescription && Math.abs(playerX - seniorGuidePos.x) < INTERACT_RANGE + 20 && (
                <div style={{
                  position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                  width: 7, height: 7, borderRadius: '50%', background: palette.wainscot,
                  animation: 'navPulse 1.2s ease-in-out infinite',
                }} />
              )}
            </div>
          )}

          {/* NPC */}
          {floor.npcs.filter(npc => !(guided && npc.id === 'senior_park')).map(npc => {
            const isNear = Math.abs(playerX - npc.x) < INTERACT_RANGE + 20
            const npcFacing = Math.abs(playerX - npc.x) < INTERACT_RANGE + 40
              ? (npc.x > playerX ? 'left' : 'right')
              : 'right'
            return (
              <div key={npc.id} style={{
                position: 'absolute', left: npc.x - CHAR_W / 2, top: CHAR_Y + 10,
                zIndex: 10, cursor: isNear ? 'pointer' : 'default',
              }} onClick={() => handleNPCClick(npc)}>
                <PixelChar facing={npcFacing} color={npc.color} />
                <div style={{
                  textAlign: 'center', fontSize: 10, marginTop: 0,
                  color: isNear ? '#E8E0D0' : '#8A8580',
                  fontWeight: isNear ? 600 : 400, whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                }}>
                  {npc.name}
                </div>
                {isNear && !activeDialogue && !roomDescription && (
                  <div style={{
                    position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                    width: 7, height: 7, borderRadius: '50%', background: palette.wainscot,
                    animation: 'navPulse 1.2s ease-in-out infinite',
                  }} />
                )}
              </div>
            )
          })}

          {/* 플레이어 */}
          <div style={{ position: 'absolute', left: playerX - CHAR_W / 2, top: CHAR_Y + 10, zIndex: 20 }}>
            <PixelChar facing={facing} walking={walking} frame={walkFrame} isPlayer />
          </div>
        </div>

        {/* 프롬프트 */}
        {roomPrompt && !activeDialogue && !roomDescription && !floorTransition && (
          <div style={{
            position: 'absolute', bottom: 76, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(26,24,21,0.92)', color: '#E8D8B8',
            padding: '7px 18px', borderRadius: 6, fontSize: 12,
            border: '1px solid rgba(200,180,140,0.2)',
            pointerEvents: 'none', whiteSpace: 'nowrap',
            backdropFilter: 'blur(4px)',
          }}>
            <span style={{ opacity: 0.5, marginRight: 8, fontSize: 11 }}>{roomPrompt.key}</span>
            {roomPrompt.text}
          </div>
        )}

        {/* 대화창 */}
        {(activeDialogue || roomDescription) && (
          <div
            onClick={closeDialogue}
            style={{
              position: 'absolute', bottom: 16, left: 16, right: 16,
              background: 'rgba(26,24,18,0.95)', borderRadius: 8, padding: '14px 18px',
              border: '1px solid rgba(200,180,140,0.18)', cursor: 'pointer',
              opacity: dialogueVisible ? 1 : 0,
              transform: dialogueVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.2s, transform 0.2s', zIndex: 30,
            }}>
            <div style={{ fontSize: 11, color: '#c4a870', fontWeight: 600, marginBottom: 6, letterSpacing: 0.5, fontFamily: sans }}>
              {activeDialogue ? activeDialogue.name : roomDescription?.name}
            </div>
            <div style={{ fontSize: 13, color: '#E8E0D0', lineHeight: 1.75, wordBreak: 'keep-all', fontFamily: "'Noto Serif KR',Georgia,serif", fontWeight: 300 }}>
              {activeDialogue ? activeDialogue.text : roomDescription?.description}
            </div>
            <div style={{ textAlign: 'right', marginTop: 8, fontSize: 10, color: '#806840', animation: 'navBlink 1.5s ease-in-out infinite' }}>▸</div>
          </div>
        )}

        {/* 제도 채널: 공문 오버레이 */}
        <DocumentOverlay document={pendingDocument} onDismiss={onDocumentSeen} />
      </div>

      {/* 조작키 안내 */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 16, padding: '8px 16px',
        background: '#1A1815', borderTop: '1px solid rgba(200,180,140,0.1)',
        flexShrink: 0, flexWrap: 'wrap',
      }}>
        {[['← →', '이동'], ['↑', '상호작용'], ['↓', '아래층'], ['클릭', '대화']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              background: 'rgba(200,180,140,0.08)', border: '1px solid rgba(200,180,140,0.15)',
              padding: '2px 7px', borderRadius: 3, fontSize: 11, color: '#A09070', fontFamily: 'monospace',
            }}>{k}</span>
            <span style={{ fontSize: 11, color: '#605040' }}>{v}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes navPulse { 0%,100%{opacity:.4;transform:translateX(-50%) scale(1)} 50%{opacity:1;transform:translateX(-50%) scale(1.3)} }
        @keyframes navBlink { 0%,100%{opacity:.3} 50%{opacity:.8} }
      `}</style>
    </div>
  )
}
