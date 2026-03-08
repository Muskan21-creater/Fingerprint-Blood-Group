import { useState } from 'react';
import {
  Upload, Dna, Fingerprint, FlaskRound as Flask,
  Menu, ChevronRight, Shield
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    bloodType: string;
    confidence: number;
    markers: string[];
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      await analyzeFingerprint(selectedFile);
    }
  };

  const analyzeFingerprint = async (selectedFile: File) => {
    setAnalyzing(true);
    setProgress(10);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Prediction failed');
      }

      setProgress(100);
      setResult({
        bloodType: data.predicted_label,
        confidence: parseFloat((data.confidence * 100).toFixed(2)),
        markers: [
          "Biometric Ridge Match",
          "Dermal Pattern Recognition",
          "AI Classification Confidence"
        ]
      });
    } catch (error: any) {
      alert('Error analyzing fingerprint: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E172A] text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 bg-[#0E172A]/90 backdrop-blur-md border-b border-teal-800/30 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Fingerprint className="w-8 h-8 text-[#2E8B86] animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 bg-[#2E8B86] blur-xl opacity-20"></div>
            </div>
            <span className="font-bold text-xl tracking-tight">BioTouch ID</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="w-5 h-5" />
                <div className="absolute inset-0 bg-teal-500/10 blur-lg opacity-0 hover:opacity-100 transition-opacity"></div>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4">
                <Button variant="ghost" className="justify-start group">
                  <Flask className="mr-2 h-4 w-4 group-hover:text-teal-400 transition-colors" />
                  About Technology
                  <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button variant="ghost" className="justify-start group">
                  <Dna className="mr-2 h-4 w-4 group-hover:text-teal-400 transition-colors" />
                  Research
                  <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent"></div>
        <div className="container mx-auto text-center relative">
          <div className="inline-block">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-teal-200 to-teal-400 bg-clip-text text-transparent">
              Decoding Life's Blueprint,<br />One Fingerprint at a Time
            </h1>
            <div className="h-1 w-1/3 mx-auto bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12 mt-8">
            Your fingerprint isn't just identity—it's a window to your biology.
            Experience the future of medical diagnostics.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 transition-all duration-300"
          >
            Start Your Analysis
          </Button>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0E172A] to-[#2E8B86]/10">
        <div className="container mx-auto">
          <Card className="max-w-xl mx-auto bg-white/5 border-teal-800/30 backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="text-center">
                <input
                  type="file"
                  id="fingerprint-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <label
                  htmlFor="fingerprint-upload"
                  className={cn(
                    "group cursor-pointer block w-full aspect-square rounded-lg border-2 border-dashed border-teal-500/50 hover:border-teal-400 transition-all duration-300 flex items-center justify-center relative overflow-hidden",
                    "before:absolute before:inset-0 before:bg-gradient-to-br before:from-teal-500/10 before:to-transparent before:opacity-0 before:group-hover:opacity-100 before:transition-opacity"
                  )}
                >
                  {file ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Uploaded fingerprint"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-teal-500 group-hover:text-teal-400 transition-colors duration-300" />
                      <p className="text-lg font-medium">Upload Your Fingerprint Scan</p>
                      <p className="text-sm text-gray-400">Click or drag and drop</p>
                    </div>
                  )}
                </label>
              </div>

              {analyzing && (
                <div className="mt-8 text-center">
                  <Progress value={progress} className="h-2 bg-teal-950" />
                  <p className="mt-4 text-teal-400 animate-pulse">Analyzing fingerprint pattern...</p>
                  <div className="mt-2 text-sm text-gray-400">Identifying genetic markers</div>
                </div>
              )}

              {result && (
                <div className="mt-8 p-6 rounded-lg bg-gradient-to-br from-white/5 to-transparent border border-teal-800/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Analysis Results</h3>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-teal-400" />
                      <span className="text-teal-400">{result.confidence}% Confidence</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-3xl font-bold shadow-lg shadow-red-500/20">
                      {result.bloodType}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Predicted Blood Type</p>
                      <p className="text-2xl font-semibold">{result.bloodType}</p>
                      <p className="text-sm text-gray-400 mt-1">High Confidence Match</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Identified Markers:</p>
                    {result.markers.map((marker, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                        {marker}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-900/5 to-transparent"></div>
        <div className="container mx-auto relative">
          <h2 className="text-3xl font-bold text-center mb-4">How BioTouch ID Works</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Our advanced AI technology analyzes your fingerprint's unique patterns to predict your blood type with high accuracy.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Fingerprint className="w-8 h-8" />,
                title: "Fingerprint Scan",
                description: "Upload your fingerprint image for detailed pattern analysis"
              },
              {
                icon: <Flask className="w-8 h-8" />,
                title: "AI Analysis",
                description: "Our advanced AI processes the unique biometric markers"
              },
              {
                icon: <Dna className="w-8 h-8" />,
                title: "Blood Group Decoding",
                description: "Receive your predicted blood type with confidence scoring"
              }
            ].map((step, index) => (
              <Card key={index} className="bg-white/5 border-teal-800/30 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-900/50 to-transparent flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
