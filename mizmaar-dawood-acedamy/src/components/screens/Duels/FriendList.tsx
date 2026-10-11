import React, { useState, useEffect } from 'react';
import {
  Users,
  Bot,
  UserPlus,
  Play,
  Shield,
  ChevronLeft,
  UserX,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { FriendUser, ProgressState, AgeGroup } from '../../../types';
import { MultiplayerService } from '../../../services/MultiplayerService';
import { TopBar } from '../../common/TopBar';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Chip } from '../../common/Chip';
import { soundService } from '../../../utils/audio';

interface FriendListProps {
  progress: ProgressState;
  ageGroup: AgeGroup;
  multiplayerService: MultiplayerService;
  onBack: () => void;
  onOpenGrownUps: () => void;
  onStartChallenge: (friend: FriendUser) => void;
}

export const FriendList: React.FC<FriendListProps> = ({
  progress,
  ageGroup,
  multiplayerService,
  onBack,
  onOpenGrownUps,
  onStartChallenge,
}) => {
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [addUsername, setAddUsername] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = multiplayerService.subscribeFriends((list) => {
      setFriends(list);
    });
    return unsub;
  }, [multiplayerService]);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUsername.trim()) return;

    soundService.playTap();
    setIsSearching(true);
    setStatusMessage(null);

    try {
      const success = await multiplayerService.sendFriendRequest(addUsername.trim());
      if (success) {
        setStatusMessage(`Added "${addUsername.trim()}" to study partners!`);
        setAddUsername('');
      } else {
        setStatusMessage(`Could not find a student named "${addUsername.trim()}".`);
      }
    } catch {
      setStatusMessage('Unable to send request right now.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRemove = async (friendId: string) => {
    soundService.playTap();
    await multiplayerService.blockUser(friendId);
  };

  const onlineEnabled = progress.grownUps.onlinePlayEnabled;

  return (
    <div className="h-full flex flex-col bg-[#F2E8D5] text-[#1B2A41] overflow-hidden">
      <TopBar
        leftAction={
          <button
            type="button"
            onClick={() => {
              soundService.playTap();
              onBack();
            }}
            aria-label="Back"
            className="w-10 h-10 rounded-xl bg-white border border-[#E4D6BA] flex items-center justify-center text-[#1B2A41] card-solid active:translate-y-[1px]"
          >
            <ChevronLeft size={20} />
          </button>
        }
        title={
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#2A5CAA]" />
            <span className="font-bold text-sm">Study Partners & Duels</span>
          </div>
        }
        rightAction={
          <button
            type="button"
            onClick={onOpenGrownUps}
            title="Grown-ups Corner"
            aria-label="Grown-ups Corner"
            className="w-10 h-10 rounded-xl bg-white border border-[#E4D6BA] flex items-center justify-center text-[#5B6B7B] hover:text-[#1B2A41] card-solid active:translate-y-[1px]"
          >
            <Shield size={18} />
          </button>
        }
      />

      <main className="flex-1 w-full max-w-[620px] mx-auto p-4 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-16">
        {/* Practice Bots Section */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#5B6B7B] flex items-center gap-1.5">
              <Bot size={14} className="text-[#2A5CAA]" />
              Mizmaar Dawood Academy Practice Guides (Always Ready)
            </h2>
            <Chip variant="lapis">Offline Ready</Chip>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {friends
              .filter((f) => f.isBot)
              .map((bot) => {
                const diffBadge =
                  bot.botDifficulty === 'slow'
                    ? { label: 'Gentle (75%)', bg: 'bg-[#CFE6FA] text-[#1F4580]' }
                    : bot.botDifficulty === 'fast'
                    ? { label: 'Expert (95%)', bg: 'bg-[#EBD9A8] text-[#7A5814]' }
                    : { label: 'Scholar (85%)', bg: 'bg-[#FAF5EA] text-[#1B2A41]' };

                return (
                  <Card
                    key={bot.id}
                    theme={ageGroup}
                    className="p-3.5 flex flex-col justify-between gap-3 border-2 hover:border-[#2A5CAA] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-[#CFE6FA] border border-[#2A5CAA] flex items-center justify-center text-[#2A5CAA]">
                          <Bot size={18} />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffBadge.bg}`}>
                          {diffBadge.label}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-[#1B2A41] capitalize">
                        {bot.username.replace('_', ' ')}
                      </h3>
                      <p className="text-[11px] text-[#5B6B7B]">{bot.levelTitle}</p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        soundService.playTap();
                        onStartChallenge(bot);
                      }}
                      className="w-full text-xs flex items-center justify-center gap-1.5"
                    >
                      <Play size={13} fill="currentColor" />
                      Duel Guide
                    </Button>
                  </Card>
                );
              })}
          </div>
        </section>

        {/* Human Study Partners Section */}
        <section className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#5B6B7B] flex items-center gap-1.5">
              <Users size={14} className="text-[#B8892B]" />
              Classmates & Study Partners
            </h2>
            <span className="text-xs text-[#5B6B7B] font-medium">
              {friends.filter((f) => !f.isBot).length} friends
            </span>
          </div>

          {/* Add Friend Form */}
          {onlineEnabled && (
            <form onSubmit={handleAddFriend} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter friend's student username..."
                  value={addUsername}
                  onChange={(e) => setAddUsername(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-white border-2 border-[#E4D6BA] text-sm text-[#1B2A41] placeholder:text-[#5B6B7B] focus:outline-none focus:border-[#2A5CAA] transition-colors"
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={isSearching || !addUsername.trim()}
                className="shrink-0 flex items-center gap-1.5 text-xs font-bold"
              >
                <UserPlus size={16} />
                Add
              </Button>
            </form>
          )}

          {statusMessage && (
            <div className="text-xs font-bold text-[#2A5CAA] px-2 flex items-center gap-1.5">
              <Sparkles size={13} />
              {statusMessage}
            </div>
          )}

          {/* Friend List Cards */}
          <div className="flex flex-col gap-2">
            {friends.filter((f) => !f.isBot).length === 0 ? (
              <div className="p-6 rounded-2xl bg-white/70 border-2 border-dashed border-[#E4D6BA] text-center flex flex-col items-center gap-2">
                <Users size={32} className="text-[#5B6B7B]/50" />
                <p className="text-sm font-semibold text-[#5B6B7B]">No classmate friends added yet.</p>
                <p className="text-xs text-[#5B6B7B] max-w-sm">
                  {onlineEnabled
                    ? 'Type in your classmate’s username above to add them for live head-to-head friendly matches!'
                    : 'Unlock online study partners in the Grown-ups Corner to duel with classmates on the local network.'}
                </p>
              </div>
            ) : (
              friends
                .filter((f) => !f.isBot)
                .map((friend) => (
                  <Card
                    key={friend.id}
                    theme={ageGroup}
                    className="p-3.5 flex items-center justify-between gap-3 border-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EBD9A8] border border-[#B8892B] flex items-center justify-center text-[#7A5814] font-black text-sm">
                        {friend.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#1B2A41]">{friend.username}</h4>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              friend.status === 'online' ? 'bg-[#3A8D5F]' : 'bg-[#5B6B7B]'
                            }`}
                            title={friend.status}
                          />
                        </div>
                        <p className="text-xs text-[#5B6B7B]">{friend.levelTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!onlineEnabled}
                        onClick={() => {
                          soundService.playTap();
                          onStartChallenge(friend);
                        }}
                        className="text-xs flex items-center gap-1.5"
                      >
                        <Play size={13} fill="currentColor" />
                        Challenge
                      </Button>

                      <button
                        type="button"
                        onClick={() => handleRemove(friend.id)}
                        title="Remove friend"
                        className="w-8 h-8 rounded-lg text-[#5B6B7B] hover:text-[#B94437] flex items-center justify-center hover:bg-[#FBEBE8] transition-colors"
                      >
                        <UserX size={15} />
                      </button>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
