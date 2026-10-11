import React, { useEffect, useState } from 'react';
import { Swords, Check, Clock, Bot, X, Shield, Sparkles } from 'lucide-react';
import { DuelSession } from '../../../types';
import { MultiplayerService } from '../../../services/MultiplayerService';
import { TopBar } from '../../common/TopBar';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Chip } from '../../common/Chip';
import { soundService } from '../../../utils/audio';

interface DuelLobbyProps {
  duelId: string;
  myUserId: string;
  multiplayerService: MultiplayerService;
  onStartGame: (duel: DuelSession) => void;
  onLeave: () => void;
}

export const DuelLobby: React.FC<DuelLobbyProps> = ({
  duelId,
  myUserId,
  multiplayerService,
  onStartGame,
  onLeave,
}) => {
  const [duel, setDuel] = useState<DuelSession | null>(null);

  useEffect(() => {
    const unsub = multiplayerService.subscribeDuel(duelId, (session) => {
      setDuel(session);
      if (session.status === 'in-progress') {
        onStartGame(session);
      }
    });
    return unsub;
  }, [duelId, multiplayerService, onStartGame]);

  if (!duel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2E8D5] text-[#1B2A41]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#2A5CAA] border-t-transparent animate-spin" />
          <p className="text-sm font-bold text-[#5B6B7B]">Connecting to duel arena...</p>
        </div>
      </div>
    );
  }

  const isChallenger = duel.challenger.id === myUserId;
  const me = isChallenger ? duel.challenger : duel.opponent;
  const opponent = isChallenger ? duel.opponent : duel.challenger;

  const handleToggleReady = async () => {
    soundService.playTap();
    await multiplayerService.setReady(duelId, !me.ready);
  };

  const handleCancel = async () => {
    soundService.playTap();
    await multiplayerService.leaveDuel(duelId);
    onLeave();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F2E8D5] text-[#1B2A41]">
      <TopBar
        leftAction={
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Cancel Duel"
            className="w-10 h-10 rounded-xl bg-white border border-[#E4D6BA] flex items-center justify-center text-[#5B6B7B] hover:text-[#B94437] card-solid active:translate-y-[1px]"
          >
            <X size={20} />
          </button>
        }
        title={
          <div className="flex items-center gap-2">
            <Swords size={18} className="text-[#2A5CAA]" />
            <span className="font-bold text-sm">Match Lobby</span>
          </div>
        }
      />

      <main className="flex-1 w-full max-w-[580px] mx-auto p-4 flex flex-col items-center justify-center gap-6 my-auto">
        {/* Match Header */}
        <div className="text-center">
          <Chip variant="lapis" className="mb-2">
            {duel.format === 'classic' ? 'Classic Duel (10 Qs)' : 'Sprint Race (15 Qs)'}
          </Chip>
          <h1 className="text-2xl font-black text-[#1B2A41]">Preparing Tajweed Arena</h1>
          <p className="text-xs text-[#5B6B7B] mt-1">
            Both reciters must declare ready to commence the round!
          </p>
        </div>

        {/* Versus Matchup Stage */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
          {/* VS Badge in Center */}
          <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#1B2A41] text-white font-black text-xs items-center justify-center border-2 border-white shadow-md">
            VS
          </div>

          {/* Player Me Card */}
          <Card
            theme={duel.ageGroup}
            className={`p-5 flex flex-col items-center text-center gap-3 border-2 transition-all ${
              me.ready ? 'border-[#3A8D5F] bg-[#FAF5EA]' : 'border-[#E4D6BA] bg-white'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#CFE6FA] border-2 border-[#2A5CAA] flex items-center justify-center text-[#2A5CAA] font-black text-xl card-solid">
              {me.username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B7B]">You</span>
              <h3 className="font-black text-base text-[#1B2A41]">{me.username}</h3>
              <p className="text-xs text-[#5B6B7B]">{me.levelTitle}</p>
            </div>

            <div
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                me.ready ? 'bg-[#3A8D5F] text-white' : 'bg-[#E4D6BA]/60 text-[#5B6B7B]'
              }`}
            >
              {me.ready ? (
                <>
                  <Check size={14} /> Ready to Recite
                </>
              ) : (
                <>
                  <Clock size={14} /> Not Ready
                </>
              )}
            </div>
          </Card>

          {/* Opponent Card */}
          <Card
            theme={duel.ageGroup}
            className={`p-5 flex flex-col items-center text-center gap-3 border-2 transition-all ${
              opponent.ready ? 'border-[#3A8D5F] bg-[#FAF5EA]' : 'border-[#E4D6BA] bg-white'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#EBD9A8] border-2 border-[#B8892B] flex items-center justify-center text-[#7A5814] font-black text-xl card-solid">
              {opponent.id.includes('bot') ? (
                <Bot size={28} />
              ) : (
                opponent.username.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B7B]">Opponent</span>
              <h3 className="font-black text-base text-[#1B2A41]">{opponent.username}</h3>
              <p className="text-xs text-[#5B6B7B]">{opponent.levelTitle}</p>
            </div>

            <div
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                opponent.ready ? 'bg-[#3A8D5F] text-white' : 'bg-[#E4D6BA]/60 text-[#5B6B7B]'
              }`}
            >
              {opponent.ready ? (
                <>
                  <Check size={14} /> Ready to Recite
                </>
              ) : (
                <>
                  <Clock size={14} /> Waiting for partner...
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Countdown banner if counting down */}
        {duel.status === 'countdown' && (
          <div className="p-4 rounded-2xl bg-[#2A5CAA] text-white text-center w-full card-solid animate-pulse">
            <span className="text-xs uppercase font-bold tracking-widest text-[#CFE6FA]">Starting in</span>
            <div className="text-4xl font-black">{duel.countdown || 3}</div>
          </div>
        )}

        {/* Action Controls */}
        <div className="w-full flex flex-col gap-2 pt-2">
          <Button
            variant={me.ready ? 'outline' : 'primary'}
            size="lg"
            onClick={handleToggleReady}
            className="w-full text-base font-bold flex items-center justify-center gap-2"
          >
            {me.ready ? 'Cancel Ready' : 'I am Ready!'}
          </Button>

          <button
            type="button"
            onClick={handleCancel}
            className="text-xs font-bold text-[#5B6B7B] hover:text-[#B94437] py-2 text-center transition-colors"
          >
            Leave Match & Return to Trail
          </button>
        </div>
      </main>
    </div>
  );
};
