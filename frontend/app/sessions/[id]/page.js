'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, MapPin, Users, ThumbsUp, Send, User, Calendar, MessageCircle, HelpCircle, TrendingUp, Lock, Info, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

export default function SessionDetailPage() {
  const params = useParams();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [upvoted, setUpvoted] = useState(new Set());

  useEffect(() => {
    fetchSession();
    fetchQuestions();

    const interval = setInterval(() => {
      fetchQuestions();
      if (session) checkLiveStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [params.id]);

  const checkLiveStatus = () => {
    if (session) {
      const now = new Date();
      const start = new Date(session.startTime);
      const end = new Date(session.endTime);
      const newIsLive = now >= start && now <= end;
      if (newIsLive !== isLive) setIsLive(newIsLive);
    }
  };

  const fetchSession = async () => {
    try {
      const response = await api.get(`/sessions/${params.id}`);
      setSession(response.data);
      const now = new Date();
      const start = new Date(response.data.startTime);
      const end = new Date(response.data.endTime);
      setIsLive(now >= start && now <= end);
    } catch (error) {
      toast.error('Failed to load session details');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/questions/session/${params.id}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to load questions');
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) {
      toast.error('Please enter a question');
      return;
    }

    try {
      await api.post(`/questions/session/${params.id}`, {
        content: newQuestion,
        authorName: authorName || null,
      });
      toast.success('Question submitted successfully');
      setNewQuestion('');
      fetchQuestions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit question');
    }
  };

  const handleUpvote = async (questionId) => {
    if (upvoted.has(questionId)) {
      toast.error('You already upvoted this question');
      return;
    }

    try {
      await api.post(`/questions/${questionId}/upvote`);
      setUpvoted(prev => new Set(prev).add(questionId));
      fetchQuestions();
      toast.success('Upvoted');
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Session not found</p>
      </div>
    );
  }

  const sessionStart = new Date(session.startTime);
  const sessionEnd = new Date(session.endTime);
  const now = new Date();
  const willStartLater = now < sessionStart;

  return (
    <div className="max-w-6xl mx-auto">
      <Link href={`/events/${session.event?.id}`} className="inline-flex items-center space-x-2 text-gray-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Event</span>
      </Link>

      <div className="card mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{session.title}</h1>
        <p className="text-gray-600 mb-6">{session.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <div>
              <div>{format(sessionStart, 'EEEE, MMMM dd, yyyy')}</div>
              <div className="font-semibold">{format(sessionStart, 'h:mm a')} - {format(sessionEnd, 'h:mm a')}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>{session.room?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Capacity: {session.capacity} people</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {session.speakers?.map((speaker) => (
            <Link key={speaker.id} href={`/speakers/${speaker.id}`} className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 hover:bg-blue-100 transition">
              {speaker.profilePhoto ? (
                <img
                  src={speaker.profilePhoto}
                  alt={speaker.fullName}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span className="text-sm">{speaker.fullName}</span>
            </Link>
          ))}
        </div>
      </div>

      {isLive ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Live Q&A</span>
                <span className="badge-live">LIVE</span>
              </h2>

              <form onSubmit={handleSubmitQuestion} className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>Ask a Question</span>
                </h3>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="mt-3 flex gap-3">
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Submit</span>
                  </button>
                </div>
              </form>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {questions.map((question) => (
                  <div key={question.id} className="border-b pb-4 hover:bg-gray-50 p-3 rounded-lg transition">
                    <p className="text-gray-800 mb-2">{question.content}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-500">
                          Asked by: <span className="font-medium">{question.authorName}</span>
                        </span>
                        <span className="text-gray-400">
                          {format(new Date(question.createdAt), 'h:mm a')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleUpvote(question.id)}
                        disabled={upvoted.has(question.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="font-semibold">{question.upvotes}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {questions.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg mb-2">No questions yet</p>
                    <p>Be the first to ask something to the speakers</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="card sticky top-20">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>Session Information</span>
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <MessageCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Questions are displayed in real-time</span>
                </div>
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Upvote questions you want answered</span>
                </div>
                <div className="flex items-start space-x-2">
                  <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Speakers can see all questions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Anonymous questions are allowed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : willStartLater ? (
        <div className="card text-center py-12">
          <Clock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Session Coming Soon</h2>
          <p className="text-gray-500">
            This session will start on {format(sessionStart, 'EEEE, MMMM dd, yyyy')} at {format(sessionStart, 'h:mm a')}
          </p>
          <p className="text-gray-500 mt-2">
            The Q&A feature will be available when the session begins.
          </p>
        </div>
      ) : (
        <div className="card text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Session Has Ended</h2>
          <p className="text-gray-500">
            This session ended on {format(sessionEnd, 'EEEE, MMMM dd, yyyy')} at {format(sessionEnd, 'h:mm a')}
          </p>
          <p className="text-gray-500 mt-2">
            You can still view the questions asked during the session.
          </p>
        </div>
      )}
    </div>
  );
}