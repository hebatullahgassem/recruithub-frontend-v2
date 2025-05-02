"use client"

import { useContext } from "react"
import { FiSun, FiMoon } from "react-icons/fi"
import { userContext } from "../../context/UserContext"
import "./ThemeToggle.css"

const ThemeToggle = () => {
  const { isLight, setIsLight } = useContext(userContext)

  const toggleTheme = () => {
    setIsLight(!isLight)
  }

  return (
    <button
      className={`theme-toggle-button ${isLight ? "light-mode" : "dark-mode"}`}
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      {isLight ? <FiMoon /> : <FiSun />}
    </button>
  )
}

export default ThemeToggle
