"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Play, Clock, User, FileText, X, Trash2 } from "lucide-react";
import { deleteTalk } from "@/app/actions/talks";
import type { Talk } from "@/lib/types";

function getYouTubeId(url: string) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/\s]{11})/
  );
  return match ? match[1] : null;
}

export default function TalkCard({ talk, isAdmin }: { talk: Talk; isAdmin: boolean }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const videoId = talk.videoUrl ? getYouTubeId(talk.videoUrl) : null;

  return (
    <>
      <div className="card p-5 hover:shadow-md transition-shadow">
        <div
          className="relative w-full h-40 rounded-xl overflow-hidden bg-brand-black cursor-pointer mb-4 group"
          onClick={() => talk.videoUrl && setVideoOpen(true)}
        >
          {videoId ? (
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={talk.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-black to-gray-800" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-brand-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
          {talk.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3" />{talk.duration}min
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {talk.topic && <span className="badge-orange">{talk.topic}</span>}
          {talk.tags.slice(0, 2).map((tag) => <span key={tag} className="badge-gray">{tag}</span>)}
        </div>

        <h2 className="font-bold text-brand-black line-clamp-2 mb-2">{talk.title}</h2>
        {talk.description && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{talk.description}</p>}

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1"><User className="w-3 h-3" />{talk.speakerName}</div>
          {talk.scheduledAt && <span>{format(new Date(talk.scheduledAt), "d MMM yyyy")}</span>}
        </div>

        <div className="flex gap-2 mt-4">
          {talk.videoUrl && (
            <button onClick={() => setVideoOpen(true)} className="btn-primary flex-1 justify-center text-xs py-1.5">
              <Play className="w-3.5 h-3.5" />Watch
            </button>
          )}
          {talk.slidesUrl && (
            <a href={talk.slidesUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1 justify-center text-xs py-1.5">
              <FileText className="w-3.5 h-3.5" />Slides
            </a>
          )}
          {isAdmin && (
            <button onClick={async () => { if (confirm("Delete this talk?")) await deleteTalk(talk.id); }} className="btn-danger px-2 py-1.5 text-xs">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {videoOpen && talk.videoUrl && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button onClick={() => setVideoOpen(false)} className="absolute -top-10 right-0 text-white hover:text-gray-300"><X className="w-6 h-6" /></button>
            <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black">
              {videoId ? (
                <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen />
              ) : (
                <video className="absolute inset-0 w-full h-full" src={talk.videoUrl} controls autoPlay />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
