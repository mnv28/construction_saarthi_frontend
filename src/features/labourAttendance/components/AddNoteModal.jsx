/**
 * AddNoteModal Component
 * Modal for adding labour notes with reason (Voice/Text/Both)
 */

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Radio from '../../../components/ui/Radio';
import { showError } from '../../../utils/toast';

export default function AddNoteModal({
    isOpen,
    onClose,
    onAdd,
    isLoading: isSubmitting,
}) {
    const { t } = useTranslation(['labourAttendance', 'common']);

    const [noteType, setNoteType] = useState('text'); // default to text
    const [voiceNote, setVoiceNote] = useState(null);
    const [voiceNoteUrl, setVoiceNoteUrl] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [errors, setErrors] = useState({});
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const timerRef = useRef(null);
    const chunksRef = useRef([]);

    // Initialize form when modal opens
    useEffect(() => {
        if (isOpen) {
            setNoteType('text');
            setVoiceNote(null);
            setVoiceNoteUrl(null);
            setNoteText('');
            setErrors({});
            setIsRecording(false);
            setRecordingTime(0);
            chunksRef.current = [];
        }
    }, [isOpen]);

    // Unified cleanup function for recording resources
    const stopResources = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // Cleanup on unmount only
    useEffect(() => {
        return () => {
            stopResources();
            if (voiceNoteUrl) {
                URL.revokeObjectURL(voiceNoteUrl);
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            stopResources();
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const validate = () => {
        const newErrors = {};

        if (noteType === 'voice' || noteType === 'both') {
            if (!voiceNote) {
                newErrors.voiceNote = t('labourDetails.errors.voiceNoteRequired');
            }
        }

        if (noteType === 'text' || noteType === 'both') {
            if (!noteText.trim()) {
                newErrors.noteText = t('labourDetails.errors.textNoteRequired');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAdd = async () => {
        if (!validate()) return;

        try {
            await onAdd?.({
                noteText: (noteType === 'text' || noteType === 'both') ? noteText.trim() : '',
                voiceFile: (noteType === 'voice' || noteType === 'both') ? (voiceNote ? [voiceNote] : null) : null,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            stopResources();
            if (voiceNoteUrl) {
                URL.revokeObjectURL(voiceNoteUrl);
                setVoiceNoteUrl(null);
            }
            onClose();
        }
    };

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : MediaRecorder.isTypeSupported('audio/webm')
                    ? 'audio/webm'
                    : 'audio/mp4';

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                if (chunksRef.current.length === 0) return;

                const audioBlob = new Blob(chunksRef.current, { type: mimeType });
                const audioFile = new File([audioBlob], `voice-note-${Date.now()}.mp3`, {
                    type: 'audio/mpeg',
                });
                const audioUrl = URL.createObjectURL(audioBlob);

                setVoiceNote(audioFile);
                setVoiceNoteUrl(audioUrl);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error('Error accessing microphone:', error);
            showError(t('labourDetails.errors.microphoneAccess'));
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRerecord = () => {
        if (voiceNoteUrl) URL.revokeObjectURL(voiceNoteUrl);
        setVoiceNote(null);
        setVoiceNoteUrl(null);
        setRecordingTime(0);
        chunksRef.current = [];
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isSubmitting) {
                    handleClose();
                }
            }}
        >
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl my-auto">
                {/* Header */}
                <div className="px-6 py-4">
                    <h3 className="text-2xl font-medium text-primary text-center">
                        {t('labourDetails.addNotes')}
                    </h3>
                </div>

                {/* Body */}
                <div className="px-6 pb-6 space-y-4">
                    {/* Note Type Selection */}
                    <div>
                        <div className="flex gap-6">
                            <Radio
                                id="note-text"
                                name="noteType"
                                value="text"
                                checked={noteType === 'text'}
                                onChange={(e) => {
                                    setNoteType(e.target.value);
                                    setErrors({});
                                }}
                                label={t('labourDetails.textNote')}
                            />
                            <Radio
                                id="note-voice"
                                name="noteType"
                                value="voice"
                                checked={noteType === 'voice'}
                                onChange={(e) => {
                                    setNoteType(e.target.value);
                                    setErrors({});
                                }}
                                label={t('labourDetails.voiceNote')}
                            />
                            <Radio
                                id="note-both"
                                name="noteType"
                                value="both"
                                checked={noteType === 'both'}
                                onChange={(e) => {
                                    setNoteType(e.target.value);
                                    setErrors({});
                                }}
                                label={t('labourDetails.both')}
                            />
                        </div>
                    </div>

                    {/* Voice Note Section */}
                    {(noteType === 'voice' || noteType === 'both') && (
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                {t('labourDetails.voiceNote')}
                                <span className="text-accent ml-1">*</span>
                            </label>
                            {isRecording ? (
                                <div
                                    className={`
                    w-full px-4 py-3 rounded-lg border bg-white
                    flex items-center gap-3
                    transition-colors
                    ${errors.voiceNote
                                            ? 'border-accent focus:border-accent'
                                            : 'border-gray-200 focus:border-[rgba(6,12,18,0.3)]'
                                        }
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                                >
                                    <button
                                        onClick={handleStopRecording}
                                        disabled={isSubmitting}
                                        className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0 hover:bg-[#9F290A] transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        <div className="w-4 h-4 bg-white rounded"></div>
                                    </button>
                                    <div className="flex-1 flex items-center gap-2 min-w-0">
                                        <div className="flex gap-1 items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-1 bg-accent rounded animate-pulse"
                                                    style={{
                                                        animationDelay: `${i * 0.1}s`,
                                                        height: `${Math.random() * 20 + 20}px`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-sm text-secondary whitespace-nowrap">
                                                {t('labourDetails.recording')}
                                            </span>
                                            <span className="text-sm font-medium text-accent">{formatTime(recordingTime)}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : voiceNoteUrl ? (
                                <div
                                    className={`
                    w-full px-4 py-3 rounded-lg border bg-white
                    flex items-center gap-3
                    transition-colors
                    ${errors.voiceNote
                                            ? 'border-accent focus:border-accent'
                                            : 'border-gray-200 focus:border-[rgba(6,12,18,0.3)]'
                                        }
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                                >
                                    <button
                                        onClick={handleStartRecording}
                                        disabled={isSubmitting}
                                        className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0 hover:bg-[#9F290A] transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        <Mic className="w-5 h-5 text-white" />
                                    </button>
                                    <div className="flex-1 flex items-center gap-2 min-w-0">
                                        <audio
                                            src={voiceNoteUrl}
                                            controls
                                            className="flex-1 h-8 min-w-0"
                                        />
                                        <button
                                            onClick={handleRerecord}
                                            disabled={isSubmitting}
                                            className="text-sm text-accent hover:underline whitespace-nowrap disabled:opacity-50"
                                        >
                                            {t('labourDetails.rerecord')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`
                    w-full px-4 py-3 rounded-lg border bg-white
                    flex items-center gap-3 cursor-pointer
                    transition-colors
                    ${errors.voiceNote
                                            ? 'border-accent focus:border-accent'
                                            : 'border-gray-200 focus:border-[rgba(6,12,18,0.3)]'
                                        }
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}
                  `}
                                    onClick={!isSubmitting ? handleStartRecording : undefined}
                                >
                                    <Mic className="w-5 h-5 text-accent" />
                                    <span className="text-secondary flex-1">
                                        {t('labourDetails.holdMicToRecord')}
                                    </span>
                                </div>
                            )}
                            {errors.voiceNote && (
                                <p className="mt-1 text-sm text-accent">{errors.voiceNote}</p>
                            )}
                        </div>
                    )}

                    {/* Text Note Section */}
                    {(noteType === 'text' || noteType === 'both') && (
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                {t('labourDetails.textNote')}
                                <span className="text-accent ml-1">*</span>
                            </label>
                            <textarea
                                value={noteText}
                                onChange={(e) => {
                                    setNoteText(e.target.value);
                                    if (errors.noteText) setErrors({ ...errors, noteText: '' });
                                }}
                                placeholder={t('labourDetails.writeNotePlaceholder')}
                                disabled={isSubmitting}
                                rows={4}
                                className={`
                  w-full px-4 py-3 rounded-lg border bg-white text-primary 
                  placeholder:text-secondary focus:outline-none transition-colors resize-none
                  ${errors.noteText
                                        ? 'border-accent focus:border-accent'
                                        : 'border-gray-200 focus:border-[rgba(6,12,18,0.3)]'
                                    }
                  ${isSubmitting
                                        ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                        : 'cursor-text'
                                    }
                `}
                            />
                            {errors.noteText && (
                                <p className="mt-1 text-sm text-accent">{errors.noteText}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 pb-6">
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-6 rounded-full"
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAdd}
                        disabled={isSubmitting}
                        className="px-6 rounded-full"
                    >
                        {isSubmitting
                            ? t('labourDetails.addingNote')
                            : t('labourDetails.addNotes')
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
}
