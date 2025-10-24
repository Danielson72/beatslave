"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = () => {
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_UI_PASS || "admin123";
    if (password === adminPass) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  if (!authenticated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                placeholder="Enter admin password"
                className="mt-1"
              />
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button onClick={handleAuth} className="w-full">
              Access Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [formData, setFormData] = useState({
    artistName: "",
    artistSlug: "",
    releaseName: "",
    releaseSlug: "",
    trackTitle: "",
    trackSlug: "",
    bpm: "",
    key: "",
    genre: "",
    mood: "",
    tags: "",
    standardPrice: "99",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("This is a UI-only admin panel. Connect to backend API to enable uploads.");

    setTimeout(() => {
      setLoading(false);
      setFormData({
        artistName: "",
        artistSlug: "",
        releaseName: "",
        releaseSlug: "",
        trackTitle: "",
        trackSlug: "",
        bpm: "",
        key: "",
        genre: "",
        mood: "",
        tags: "",
        standardPrice: "99",
        isActive: true,
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Track</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="artistName">Artist Name</Label>
                <Input
                  id="artistName"
                  value={formData.artistName}
                  onChange={(e) =>
                    setFormData({ ...formData, artistName: e.target.value })
                  }
                  placeholder="The Tru Witnesses"
                  required
                />
              </div>
              <div>
                <Label htmlFor="artistSlug">Artist Slug</Label>
                <Input
                  id="artistSlug"
                  value={formData.artistSlug}
                  onChange={(e) =>
                    setFormData({ ...formData, artistSlug: e.target.value })
                  }
                  placeholder="the-tru-witnesses"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="releaseName">Release Name</Label>
                <Input
                  id="releaseName"
                  value={formData.releaseName}
                  onChange={(e) =>
                    setFormData({ ...formData, releaseName: e.target.value })
                  }
                  placeholder="Tru Witness Vol. 1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="releaseSlug">Release Slug</Label>
                <Input
                  id="releaseSlug"
                  value={formData.releaseSlug}
                  onChange={(e) =>
                    setFormData({ ...formData, releaseSlug: e.target.value })
                  }
                  placeholder="tru-witness-vol-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trackTitle">Track Title</Label>
                <Input
                  id="trackTitle"
                  value={formData.trackTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, trackTitle: e.target.value })
                  }
                  placeholder="Kronological"
                  required
                />
              </div>
              <div>
                <Label htmlFor="trackSlug">Track Slug</Label>
                <Input
                  id="trackSlug"
                  value={formData.trackSlug}
                  onChange={(e) =>
                    setFormData({ ...formData, trackSlug: e.target.value })
                  }
                  placeholder="kronological"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="bpm">BPM</Label>
                <Input
                  id="bpm"
                  type="number"
                  value={formData.bpm}
                  onChange={(e) =>
                    setFormData({ ...formData, bpm: e.target.value })
                  }
                  placeholder="85"
                />
              </div>
              <div>
                <Label htmlFor="key">Key</Label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({ ...formData, key: e.target.value })
                  }
                  placeholder="G Minor"
                />
              </div>
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                  placeholder="Hip Hop"
                />
              </div>
              <div>
                <Label htmlFor="mood">Mood</Label>
                <Input
                  id="mood"
                  value={formData.mood}
                  onChange={(e) =>
                    setFormData({ ...formData, mood: e.target.value })
                  }
                  placeholder="Dark"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="Gospel, Boom Bap, Underground"
              />
            </div>

            <div>
              <Label htmlFor="standardPrice">Standard Price (cents)</Label>
              <Input
                id="standardPrice"
                type="number"
                value={formData.standardPrice}
                onChange={(e) =>
                  setFormData({ ...formData, standardPrice: e.target.value })
                }
                placeholder="99"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked === true })
                }
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active (visible in catalog)
              </Label>
            </div>

            <div className="space-y-3 border-t pt-6">
              <p className="text-sm font-semibold">File Uploads (UI Only - Backend Required)</p>
              <div>
                <Label htmlFor="cover">Cover Image</Label>
                <Input id="cover" type="file" accept="image/*" disabled />
              </div>
              <div>
                <Label htmlFor="audio">Audio File (WAV)</Label>
                <Input id="audio" type="file" accept="audio/*" disabled />
              </div>
              <div>
                <Label htmlFor="preview">Preview Clip (MP3)</Label>
                <Input id="preview" type="file" accept="audio/*" disabled />
              </div>
            </div>

            {message && (
              <div className="text-sm bg-blue-50 text-blue-900 p-3 rounded-md">
                {message}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "Saving..." : "Create Track"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8 bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">v1.1 Features (Database Ready)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-900 space-y-2">
          <p>✓ Premium License ($4.99) - Schema ready</p>
          <p>✓ Exclusive License ($49.99) - Schema ready</p>
          <p>✓ Royalty tracking tiers - Schema ready</p>
          <p>✓ License agreements - Schema ready</p>
          <p>✓ Terms acceptance tracking - Active</p>
          <p className="pt-2 font-semibold">
            All v1.1 fields exist in database but are not exposed in v1.0 UI
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
