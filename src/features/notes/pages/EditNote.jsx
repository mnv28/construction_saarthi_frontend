/**
 * Edit Note Page
 * Form to edit an existing note
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES_FLAT } from "../../../constants/routes";
import PageHeader from "../../../components/layout/PageHeader";
import Input from "../../../components/ui/Input";
import Radio from "../../../components/ui/Radio";
import DateTimePicker from "../../../components/ui/DateTimePicker";
import RichTextEditor from "../../../components/ui/RichTextEditor";
import Button from "../../../components/ui/Button";
import Dropdown from "../../../components/ui/Dropdown";
import { useNoteDetails } from "../hooks/useNoteDetails";
import { useNotesProjects } from "../hooks/useNotesProjects";
import { useAuth } from "../../../features/auth/store/authStore";
import { updateNote } from "../api/notesApi";
import { showError, showSuccess } from "../../../utils/toast";

export default function EditNote() {
  const { t } = useTranslation("notes");
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedWorkspace } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch note details
  const { note, isLoading } = useNoteDetails(id);

  // Fetch projects
  const { projects } = useNotesProjects(selectedWorkspace);
  const projectOptions = projects.map((p) => ({
    value: p.id?.toString(),
    label: p.name,
  }));

  // Form state
  const [title, setTitle] = useState("");
  const [assignTo, setAssignTo] = useState([]); // Array for multiple projects
  const [noteType, setNoteType] = useState("Text");
  const [textNote, setTextNote] = useState("");
  const [reminderDateTime, setReminderDateTime] = useState(null);
  // Voice playback state
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Load note data when fetched
  useEffect(() => {
    if (!note) return;

    setTitle(note.title || "");

    // Set project IDs from note
    if (note.originalData?.projects && note.originalData.projects.length > 0) {
      const projectIds = note.originalData.projects.map((p) =>
        p.projectId?.toString(),
      );
      setAssignTo(projectIds);
    }

    // Backend structure: note.originalData.notes can contain textNotes[] and voiceMemos[]
    const textNotes = note.originalData?.notes?.textNotes || [];
    const voiceMemos = note.originalData?.notes?.voiceMemos || [];

    // Determine note type based on presence of text and voice data
    if (textNotes.length > 0 && voiceMemos.length > 0) {
      setNoteType("Both");
    } else if (voiceMemos.length > 0) {
      setNoteType("Voice");
    } else {
      setNoteType("Text");
    }

    // Set text content (use first text note if available)
    if (textNotes.length > 0) {
      setTextNote(textNotes[0].text || "");
    }

    // Set voice URL (use first voice memo if available)
    if (voiceMemos.length > 0) {
      setVoiceUrl(voiceMemos[0].url || null);
      // set duration if provided
      if (voiceMemos[0].duration) setDuration(voiceMemos[0].duration);
    } else {
      setVoiceUrl(null);
      setDuration(0);
    }
    // reset volume/mute when loading
    setVolume(1);
    setIsMuted(false);

    // Set reminder date
    if (note.reminderDate) {
      setReminderDateTime(new Date(note.reminderDate));
    }
  }, [note]);

  const noteTypeOptions = [
    { value: "Text", label: t("form.text") },
    { value: "Voice", label: t("form.voice") },
    { value: "Both", label: t("form.both") },
  ];

  const formatTimeDisplay = (current, total) => {
    const secs = Math.floor(current || 0);
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Keep audio element in sync with volume/mute state
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
  }, [volume, isMuted]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showError(t("form.titleRequired", { defaultValue: "Title is required" }));
      return;
    }

    if (assignTo.length === 0) {
      showError(
        t("form.projectRequired", {
          defaultValue: "Please select at least one project",
        }),
      );
      return;
    }

    // if (!reminderDateTime) {
    //   showError(
    //     t("form.reminderRequired", {
    //       defaultValue: "Reminder date is required",
    //     }),
    //   );
    //   return;
    // }

    if ((noteType === "Text" || noteType === "Both") && !textNote.trim()) {
      showError(
        t("form.textRequired", { defaultValue: "Text note is required" }),
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Format reminder date (YYYY-MM-DD)
      // Format reminder date (YYYY-MM-DD)
      // const reminderDate = reminderDateTime?.toISOString().split("T")[0];

      // Prepare update data
      const updateData = {
        title: title.trim(),
        workspaceId: parseInt(selectedWorkspace) || 0,
        workspaceId: parseInt(selectedWorkspace) || 0,
        // reminderDate: reminderDate,
        projectIds: assignTo.map((id) => parseInt(id)),
        file_type: noteType,
        text: textNote.trim(),
        url: null, // Will be set if there's a voice memo or attachment
      };

      // If note type is Voice or Both, keep existing voice memo URL if present
      if (noteType === "Voice" || noteType === "Both") {
        const existingVoiceUrl =
          note?.originalData?.notes?.voiceMemos?.[0]?.url;
        if (existingVoiceUrl) {
          updateData.url = existingVoiceUrl;
        }
      }

      await updateNote(id, updateData);

      showSuccess(
        t("noteUpdated", { defaultValue: "Note updated successfully" }),
      );
      navigate(-1);
    } catch (err) {
      console.error("Error updating note:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        t("updateError", { defaultValue: "Failed to update note" });
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={
          isLoading
            ? t("loading", { defaultValue: "Loading..." })
            : title || t("editNote", { defaultValue: "Edit Note" })
        }
        onBack={() => navigate(-1)}
      />

      {/* Form */}
      <div>
        <div className="space-y-6">
          {/* Title */}
          <Input
            label={t("form.title")}
            placeholder={t("form.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Assign To - Multiple Projects */}
          {/* <div>
            <label className="block text-sm font-normal text-black mb-2">
              {t('form.assignTo')}<span>*</span>
            </label>
            <Dropdown
              options={projectOptions}
              value={assignTo.length > 0 ? assignTo[0] : ''}
              onChange={(value) => {
                if (value && !assignTo.includes(value)) {
                  setAssignTo([...assignTo, value]);
                }
              }}
              placeholder={t('form.selectProject')}
            />
            {assignTo.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {assignTo.map((projectId) => {
                  const project = projectOptions.find((p) => p.value === projectId);
                  return project ? (
                    <span
                      key={projectId}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-primary flex items-center gap-2"
                    >
                      {project.label}
                      <button
                        onClick={() => setAssignTo(assignTo.filter(id => id !== projectId))}
                        className="text-secondary hover:text-primary cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div> */}

          {/* Notes Type */}
          <div>
            <label className="block text-sm font-normal text-black mb-3">
              {t("form.notesType")}
            </label>
            <div className="flex items-center gap-6">
              {noteTypeOptions.map((option) => (
                <Radio
                  key={option.value}
                  name="noteType"
                  value={option.value}
                  label={option.label}
                  checked={noteType === option.value}
                  onChange={() => setNoteType(option.value)}
                />
              ))}
            </div>
          </div>

          {/* Voice Note Player (if voice or both) */}
          {(noteType === "Voice" || noteType === "Both") && (
            <div>
              <label className="block text-sm font-normal text-black mb-2">
                {t("form.voiceNote")}
              </label>
              {voiceUrl ? (
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (!audioRef.current) return;
                        if (isPlaying) {
                          audioRef.current.pause();
                        } else {
                          audioRef.current.play();
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-accent flex items-center justify-center cursor-pointer"
                    >
                      {/* simple play/pause triangle/square */}
                      {!isPlaying ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 3v18l15-9L5 3z" fill="white" />
                        </svg>
                      ) : (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="4"
                            y="5"
                            width="4"
                            height="14"
                            fill="white"
                          />
                          <rect
                            x="12"
                            y="5"
                            width="4"
                            height="14"
                            fill="white"
                          />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-3">
                        <div
                          className="flex-1 h-3 bg-[#e9ecef] rounded-full overflow-hidden relative"
                          onClick={(e) => {
                            if (!audioRef.current) return;
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const pct = Math.max(
                              0,
                              Math.min(1, clickX / rect.width),
                            );
                            const seekTime =
                              pct *
                              (duration || audioRef.current.duration || 0);
                            audioRef.current.currentTime = seekTime;
                          }}
                        >
                          <div
                            className="absolute left-0 top-0 h-full bg-accent"
                            style={{
                              width: `${(duration ? currentTime / duration : 0) * 100}%`,
                            }}
                          />
                        </div>

                        <div className="w-12 text-right text-xs text-secondary">
                          {formatTimeDisplay(currentTime || 0, duration)}
                        </div>
                      </div>

                      {/* volume controls */}
                      <div className="flex items-center gap-2 ml-3">
                        <button
                          onClick={() => {
                            const muted = !isMuted;
                            setIsMuted(muted);
                            if (audioRef.current)
                              audioRef.current.muted = muted;
                          }}
                          className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center"
                        >
                          {!isMuted ? (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 10v4h4l5 5V5L7 10H3z"
                                fill="#A04124"
                              />
                              <path
                                d="M16 8.82a4 4 0 010 6.36"
                                stroke="#A04124"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 10v4h4l5 5V5L7 10H3z"
                                fill="#A04124"
                              />
                              <path
                                d="M19 5l-6 6m0 0l6 6m-6-6h8"
                                stroke="#A04124"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            setVolume(v);
                            if (audioRef.current) {
                              audioRef.current.volume = v;
                              audioRef.current.muted = false;
                              setIsMuted(false);
                            }
                          }}
                          className="h-2 w-28"
                        />
                      </div>
                    </div>
                  </div>
                  {/* hidden audio element controlled by UI */}
                  <audio
                    ref={audioRef}
                    src={voiceUrl}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                    onLoadedMetadata={(e) => setDuration(e.target.duration)}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-secondary">
                    {t("noVoiceNote", {
                      defaultValue: "No voice note attached",
                    })}
                  </p>
                </div>
              )}
              <p className="text-xs text-secondary mt-2">
                {t("voiceNoteInfo", {
                  defaultValue:
                    "Voice note cannot be edited. Upload a new one if needed.",
                })}
              </p>
            </div>
          )}

          {/* Text Note */}
          {(noteType === "Text" || noteType === "Both") && (
            <div>
              <label className="block text-sm font-normal text-black mb-2">
                {t("form.note")}
                <span>*</span>
              </label>
              <RichTextEditor
                value={textNote}
                onChange={setTextNote}
                placeholder={t("form.enterTextHere")}
              />
            </div>
          )}

          {/* Add Reminder */}
          {/* <DateTimePicker
            label={t('form.addReminder')}
            value={reminderDateTime}
            onChange={setReminderDateTime}
            placeholder="DD/MM/YYYY HH:MM"
            required
          /> */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end pt-4">
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              {t("form.cancel")}
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSubmitting || isLoading}
              className="w-full sm:w-auto"
            >
              {isSubmitting
                ? t("saving", { defaultValue: "Saving..." })
                : t("form.saveChanges")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
