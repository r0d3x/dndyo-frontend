import React, { createContext, useContext, useState, useEffect } from 'react';
import { seedDemoGame, getGameState } from '../services/api';

const GameContext = createContext();

export function GameProvider({ children }) {
    const [gameId, setGameId] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activePlayerId, setActivePlayerId] = useState(null);

    const createDemoGame = async () => {
        setIsLoading(true);
        try {
            const game = await seedDemoGame();
            setGameId(game.id);
            const state = await getGameState(game.id);
            setGameState(state);
        } catch (error) {
            console.error("Failed to initialize game:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const joinGame = async (id) => {
        setIsLoading(true);
        try {
            setGameId(id);
            const state = await getGameState(id);
            setGameState(state);
        } catch (error) {
            console.error("Failed to join game:", error);
            setGameId(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchState = async () => {
        if (!gameId) return;
        try {
            const state = await getGameState(gameId);
            setGameState(state);
        } catch (error) {
            console.error("Failed to fetch state inline:", error);
        }
    };

    // Auto-refresh state periodically to catch AI updates universally
    useEffect(() => {
        if (!gameId) return;
        const interval = setInterval(() => {
            fetchState();
        }, 3000);
        return () => clearInterval(interval);
    }, [gameId]);

    return (
        <GameContext.Provider value={{ gameId, gameState, fetchState, isLoading, createDemoGame, joinGame, activePlayerId, setActivePlayerId }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
