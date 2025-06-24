"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { generateSummary, SummaryFormat } from "@/server-actions/ai-summary";
import { ShineBorder } from "../magicui/shine-border";
import { RainbowButton } from "../magicui/rainbow-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SummaryProps {
  content: string;
  title?: string;
}

export default function Summary({ content, title }: SummaryProps) {
  const [summary, setSummary] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] =
    useState<SummaryFormat>("paragraph");
  const [error, setError] = useState<string>("");

  // Speech synthesis hook
  const {
    isSpeaking,
    isPaused,
    availableVoices,
    selectedVoice,
    setSelectedVoice,
    speechRate,
    setSpeechRate,
    speak,
    pause,
    resume,
    stop,
    isSupported,
  } = useSpeechSynthesis({
    onError: (errorMsg) => {
      setError(errorMsg);
    },
  });

  const handleGenerateSummary = async (format: SummaryFormat) => {
    setLoading(true);
    setError("");
    setSelectedFormat(format);

    try {
      const result = await generateSummary({
        content,
        format,
        title,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSummary(result.summary);
        setWordCount(result.wordCount);
      }
    } catch (err) {
      setError("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (summary) {
      speak(summary);
    }
  };

  const handleSpeedChange = (value: string) => {
    const newRate = parseFloat(value);
    console.log("Changing speech rate to:", newRate); // Debug log
    setSpeechRate(newRate);
  };

  const formatOptions: {
    value: SummaryFormat;
    label: string;
    description: string;
    icon: string;
  }[] = [
    {
      value: "paragraph",
      label: "Paragraph",
      description: "Flowing paragraph format",
      icon: "tabler:file-text",
    },
    {
      value: "bullet-points",
      label: "Bullet Points",
      description: "Key points in list format",
      icon: "tabler:list",
    },
    {
      value: "headline",
      label: "Headline",
      description: "Single impactful sentence",
      icon: "tabler:heading",
    },
    {
      value: "section-wise",
      label: "Section-wise",
      description: "Breakdown by sections",
      icon: "tabler:layout-grid",
    },
  ];

  return (
    <Card className="w-full relative">
      <ShineBorder
        borderWidth={2}
        shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
      />

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon="ix:ai" width="24" height="24" /> Summarize with AI
        </CardTitle>

        {/* Format Selection */}
        <div className="flex mt-3 flex-wrap gap-2">
          {formatOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedFormat === option.value ? "default" : "outline"}
              onClick={() => handleGenerateSummary(option.value)}
              disabled={loading}
              className="text-xs rounded-full"
              size="sm"
            >
              <Icon icon={option.icon} className="h-3 w-3 mr-1" />
              {option.label}
              <Badge variant="secondary" className="ml-1 hidden   text-xs">
                {option.description}
              </Badge>
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon icon="tabler:loader-2" className="h-4 w-4 animate-spin" />
            Generating {selectedFormat} summary...
          </div>
        )}

        {error && (
          <div className="text-sm text-destructive">
            <Icon icon="tabler:alert-circle" className="h-4 w-4 inline mr-1" />
            {error}
          </div>
        )}

        {summary && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Summary ({selectedFormat})</span>
              <Badge variant="outline">{wordCount} words</Badge>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className={`summary-markdown summary-${selectedFormat}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {summary}
                </ReactMarkdown>
              </div>
            </div>

            {/* Voice Controls */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Icon icon="tabler:volume" className="h-4 w-4" />
                Listen to Summary
              </div>

              {!isSupported && (
                <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
                  <Icon
                    icon="tabler:alert-triangle"
                    className="h-4 w-4 inline mr-1"
                  />
                  Speech synthesis is not supported in your browser. Try using
                  Chrome, Firefox, or Safari.
                </div>
              )}

              <div className="flex flex-wrap gap-3 items-center">
                {/* Voice Selection */}
                <Select
                  value={selectedVoice}
                  onValueChange={setSelectedVoice}
                  disabled={!isSupported}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue
                      placeholder={
                        isSupported ? "Select voice" : "Not supported"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Speed Control */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Speed:</span>
                  <Select
                    value={speechRate.toString()}
                    onValueChange={handleSpeedChange}
                    disabled={!isSupported}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x</SelectItem>
                      <SelectItem value="0.75">0.75x</SelectItem>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="1.25">1.25x</SelectItem>
                      <SelectItem value="1.5">1.5x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Debug info */}
                {process.env.NODE_ENV === "development" && (
                  <div className="text-xs text-muted-foreground">
                    Rate: {speechRate} | Supported: {isSupported ? "Yes" : "No"}
                  </div>
                )}

                {/* Playback Controls */}
                <div className="flex gap-2">
                  {!isSpeaking && !isPaused && (
                    <Button
                      size="sm"
                      onClick={handleSpeak}
                      className="rounded-full"
                      disabled={!isSupported}
                    >
                      <Icon
                        icon="tabler:player-play"
                        className="h-4 w-4 mr-1"
                      />
                      Play
                    </Button>
                  )}

                  {isSpeaking && !isPaused && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={pause}
                      className="rounded-full"
                    >
                      <Icon
                        icon="tabler:player-pause"
                        className="h-4 w-4 mr-1"
                      />
                      Pause
                    </Button>
                  )}

                  {isPaused && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resume}
                      className="rounded-full"
                    >
                      <Icon
                        icon="tabler:player-play"
                        className="h-4 w-4 mr-1"
                      />
                      Resume
                    </Button>
                  )}

                  {(isSpeaking || isPaused) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={stop}
                      className="rounded-full"
                    >
                      <Icon
                        icon="tabler:player-stop"
                        className="h-4 w-4 mr-1"
                      />
                      Stop
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!summary && !loading && !error && (
          <div className="text-center text-muted-foreground py-8">
            <Icon
              className="h-8 w-8 mx-auto mb-2  "
              icon="material-icon-theme:gemini-ai"
              width="16"
              height="16"
            />
            <p className="text-sm">
              Select a format above to generate an AI summary
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
