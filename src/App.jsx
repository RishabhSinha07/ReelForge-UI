import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Play, Plus, Loader2, Video, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [formData, setFormData] = useState({
    idea: '',
    theme: 'cinematic',
    name: '',
    duration: 30
  });

  const fetchReels = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/reels`);
      setReels(res.data);
    } catch (err) {
      console.error("Failed to fetch reels", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
    const interval = setInterval(fetchReels, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.idea || !formData.name) return;

    try {
      setGenerating(true);
      await axios.post(`${API_BASE_URL}/generate`, formData);
      setFormData({
        idea: '',
        theme: 'cinematic',
        name: '',
        duration: 30
      });
      fetchReels();
    } catch (err) {
      alert("Error starting generation: " + (err.response?.data?.detail || err.message));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Video size={20} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight">REEL<span className="text-primary">FORGE</span></span>
        </div>
        <button
          onClick={fetchReels}
          className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Hero & Form */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-black leading-[1.1] mb-6">
              Create Viral <br />
              <span className="text-gradient">AI Wonders</span> <br />
              In Seconds.
            </h1>
            <p className="text-xl text-white/60 mb-8 max-w-md leading-relaxed">
              Transform your wildest ideas into professional cinematic reels using our advanced AI factory.
            </p>
            <div className="flex items-center gap-6 text-white/40">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-white/10 flex items-center justify-center">
                    <Sparkles size={14} />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">Join 2,000+ creators building the future.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card !p-8"
          >
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white/50 mb-2 ml-1">REEL NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. SpaceFarewell"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-colors"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white/50 mb-2 ml-1">DURATION (sec)</label>
                  <input
                    type="number"
                    min="10"
                    max="60"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-colors"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 10 })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/50 mb-2 ml-1">THE IDEA</label>
                <textarea
                  placeholder="The final sunset seen from a dying space station..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 h-32 resize-none focus:outline-none focus:border-primary/50 transition-colors"
                  value={formData.idea}
                  onChange={e => setFormData({ ...formData, idea: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/50 mb-2 ml-1">THEME</label>
                <div className="grid grid-cols-3 gap-3">
                  {['cinematic', 'mystery', 'vibrant'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, theme: t })}
                      className={`py-3 rounded-xl border transition-all ${formData.theme === t ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={generating}
                className="btn-primary w-full flex items-center justify-center gap-3"
              >
                {generating ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Forging Reel...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Magic
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Gallery */}
        <section className="mt-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black mb-2">Vault</h2>
              <p className="text-white/40">Your collection of AI-generated masterpieces.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {reels.map((reel) => (
                <motion.div
                  key={reel.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card group cursor-pointer overflow-hidden"
                  onClick={() => reel.status === 'completed' && setSelectedVideo(`${API_BASE_URL}${reel.video_path}`)}
                >
                  <div className="relative aspect-[9/16] bg-white/5 rounded-2xl mb-4 overflow-hidden flex items-center justify-center text-center group">
                    {reel.status === 'completed' ? (
                      <>
                        <video
                          src={`${API_BASE_URL}${reel.video_path}`}
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <div className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-2xl">
                          <Play className="fill-white text-white translate-x-0.5" size={28} />
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full backdrop-blur-md border border-green-500/30">READY</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <Loader2 className={`w-14 h-14 text-primary ${reel.status === 'processing' ? 'animate-spin' : ''}`} />
                          {reel.status === 'processing' && <Sparkles className="absolute -top-1 -right-1 text-accent animate-pulse" size={20} />}
                        </div>
                        <p className={`font-black text-sm uppercase tracking-[0.2em] ${reel.status === 'failed' ? 'text-red-500' : 'text-primary'}`}>{reel.status}</p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-1 truncate">{reel.name}</h3>
                  <p className="text-white/40 text-sm line-clamp-1">{reel.idea}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-sm w-full h-[80vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 glass rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
