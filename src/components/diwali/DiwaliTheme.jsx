import React from 'react'
import { DIWALI_CONFIG } from './diwaliConfig'
import DiwaliBanner from './DiwaliBanner'
import FairyLights from './FairyLights'
import FestiveHeaderGarland from './FestiveHeaderGarland'
import GoldenFirework from './GoldenFirework'
import DiwaliRocket from './DiwaliRocket'
import MarigoldFloorArrangement from './MarigoldFloorArrangement'
import Diya from './Diya'
import SkyLantern from './SkyLantern'
import MarigoldAccent from './MarigoldAccent'
import Rangoli from './Rangoli'
import FestiveParticles from './FestiveParticles'
import '../../styles/diwali.css'

export {
  DIWALI_CONFIG,
  DiwaliBanner,
  FairyLights,
  FestiveHeaderGarland,
  SkyLantern,
  GoldenFirework,
  DiwaliRocket,
  MarigoldFloorArrangement,
  Diya,
  MarigoldAccent,
  Rangoli,
  FestiveParticles,
}

/**
 * Master Diwali Festive Wrapper
 * Can be completely deactivated post-festival by setting `DIWALI_CONFIG.enabled = false`.
 */
export default function DiwaliTheme() {
  if (!DIWALI_CONFIG.enabled) return null
  return <DiwaliBanner />
}
