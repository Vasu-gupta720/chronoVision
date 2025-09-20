import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Smartphone, QrCode, Eye, Zap, Sparkles, ArrowLeft, MapPin, Clock, Calendar, Users, Crown } from 'lucide-react';
import { getARSites, type HeritageSite } from '../data/heritage-sites';
import { HistoryModal } from './HistoryModal';
import QRCode from 'qrcode.react';

interface ARViewProps {
  onBack: () => void;
  selectedSiteId?: string | null;
}

export function ARView({ onBack, selectedSiteId }: ARViewProps) {
  const [temples, setTemples] = useState<HeritageSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemple, setSelectedTemple] = useState<number | null>(null);

  useEffect(() => {
    const fetchAndSetSites = async () => {
      setIsLoading(true);
      try {
        const arSites = await getARSites();
        setTemples(arSites);

        // This logic now runs after the temples have been fetched
        if (selectedSiteId) {
          const siteIdNumber = parseInt(selectedSiteId, 10);
          const index = arSites.findIndex(
            (temple) => temple.id === siteIdNumber
          );
          setSelectedTemple(index !== -1 ? index : null);
        }
      } catch (error) {
        console.error("Failed to fetch AR sites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetSites();
  }, [selectedSiteId]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  return (
    <section className="min-h-screen bg-card relative z-10 shadow-2xl pt-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-8 text-primary hover:text-primary hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Eye className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="gradient-text">AR Heritage Experience</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Immerse yourself in the sacred beauty of ancient Indian heritage
            sites through cutting-edge Augmented Reality technology. Scan the QR
            code with your mobile device to begin your spiritual journey.
          </p>
        </div>

        {selectedTemple !== null ? (
          /* Individual Temple QR Code View */
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* QR Code Section */}
              <div className="order-2 lg:order-1">
                <Card className="glass border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <QrCode className="h-6 w-6 text-primary" />
                      <h3>{temples[selectedTemple].title} AR</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Scan this QR code to experience{" "}
                      {temples[selectedTemple].title} in AR
                    </p>
                  </CardHeader>

                  <CardContent className="flex flex-col items-center space-y-6">
                    {/* Real QR Code */}
<div className="relative">
  <div className="w-64 h-64 bg-white rounded-lg p-4 shadow-2xl flex items-center justify-center">
    <QRCode value={temples[selectedTemple].arUrl ?? ''} size={240} />
  </div>
  <div className="absolute -inset-4 border-2 border-primary rounded-lg animate-pulse"></div>
</div>
                    

                    <div className="text-center space-y-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/20 text-primary"
                      >
                        <Smartphone className="h-3 w-3 mr-1" />
                        Mobile Required
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Compatible with iOS Safari & Android Chrome
                      </p>
                    </div>

                    {/* Fallback URL */}
                    <div className="w-full p-4 bg-muted/20 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-2">
                        Manual Link:
                      </p>
                      <a href={temples[selectedTemple].arUrl} target="_blank">
                        <code className="text-xs text-primary break-all">
                          {temples[selectedTemple].arUrl}
                        </code>
                      </a>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {temples[selectedTemple].history && (
                        <Button
                          variant="default"
                          className="w-full bg-gradient-to-r from-accent to-secondary hover:from-accent/80 hover:to-secondary/80"
                          onClick={() => setHistoryModalOpen(true)}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Know the History
                        </Button>
                      )}

                      <Button
                        onClick={() => setSelectedTemple(null)}
                        variant="outline"
                        className="w-full"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Heritage Sites List
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Temple Details */}
              <div className="order-1 lg:order-2">
                <div className="space-y-6">
                  <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold mb-4 gradient-text">
                      {temples[selectedTemple].title}
                    </h2>
                    <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">
                        {temples[selectedTemple].location}
                      </span>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">
                      {temples[selectedTemple].description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {temples[selectedTemple].elevation && (
                      <Card className="glass p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent mb-2">
                            {temples[selectedTemple].elevation}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Elevation
                          </div>
                        </div>
                      </Card>
                    )}
                    <Card className="glass p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary mb-2">
                          {temples[selectedTemple].built ||
                            temples[selectedTemple].year}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Built
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="glass border-accent/20">
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4 flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-accent" />
                        AR Experience Features
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• 360° heritage site exploration</li>
                        <li>• Historical timeline overlay</li>
                        <li>• Interactive architectural details</li>
                        <li>• Sacred geometry visualization</li>
                        <li>• Audio cultural guidance</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Temple Selection View */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Fixed Instructions Section */}
            <div className="order-1 lg:order-1 lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <Card className="ar-instructions-card border-2 border-primary/30 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Zap className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="gradient-text mb-2">
                          How to Experience AR
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          Follow these simple steps to explore heritage sites in
                          augmented reality
                        </p>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            step: "1",
                            title: "Select Heritage Site",
                            description:
                              "Choose a heritage site from the list to generate its QR code",
                            icon: QrCode,
                            color: "primary",
                          },
                          {
                            step: "2",
                            title: "Scan QR Code",
                            description:
                              "Use your phone's camera to scan the site-specific QR code",
                            icon: Eye,
                            color: "secondary",
                          },
                          {
                            step: "3",
                            title: "Explore in AR",
                            description:
                              "Experience the heritage site in immersive augmented reality",
                            icon: Sparkles,
                            color: "accent",
                          },
                        ].map((item, index) => {
                          const IconComponent = item.icon;
                          return (
                            <div
                              key={index}
                              className="flex items-start space-x-4 p-4 rounded-lg bg-muted/10 border border-border/50 hover:border-primary/30 transition-all duration-300"
                            >
                              <div className="flex-shrink-0">
                                <div
                                  className={`w-12 h-12 bg-gradient-to-br ${
                                    item.color === "primary"
                                      ? "from-primary/20 to-primary/10"
                                      : item.color === "secondary"
                                      ? "from-secondary/20 to-secondary/10"
                                      : "from-accent/20 to-accent/10"
                                  } rounded-full flex items-center justify-center border border-border/30`}
                                >
                                  <span
                                    className={`${
                                      item.color === "primary"
                                        ? "text-primary"
                                        : item.color === "secondary"
                                        ? "text-secondary"
                                        : "text-accent"
                                    } font-semibold text-lg`}
                                  >
                                    {item.step}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  <IconComponent
                                    className={`h-4 w-4 ${
                                      item.color === "primary"
                                        ? "text-primary"
                                        : item.color === "secondary"
                                        ? "text-secondary"
                                        : "text-accent"
                                    }`}
                                  />
                                  <h4 className="font-medium text-sm">
                                    {item.title}
                                  </h4>
                                </div>
                                <p className="text-muted-foreground text-xs leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center space-x-2 mb-3">
                          <Smartphone className="h-5 w-5 text-primary" />
                          <h4 className="font-medium text-sm">Requirements</h4>
                        </div>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>Mobile device (iOS 12+ or Android 8+)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                            <span>Camera access enabled</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                            <span>Stable internet connection</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Scrollable Heritage Site Selection */}
            <div className="order-2 lg:order-2 lg:col-span-3">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center space-x-2">
                    <Sparkles className="h-6 w-6 text-accent" />
                    <span>Select Heritage Site for AR</span>
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-primary"
                  >
                    {temples.length} Sites Available
                  </Badge>
                </div>

                <div className="max-h-[600px] overflow-y-auto pr-4 space-y-4 site-list-scroll p-2">
                  {temples.map((temple, index) => (
                    <Card
                      key={temple.id}
                      className="site-selection-card glass hover:border-primary/40 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-xl"
                      onClick={() => setSelectedTemple(index)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-medium group-hover:text-primary transition-colors text-lg pr-4">
                                {temple.title}
                              </h4>
                              <Badge
                                variant="secondary"
                                className="bg-accent/20 text-accent whitespace-nowrap"
                              >
                                AR Ready
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1 mb-3">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {temple.location}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                              {temple.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {temple.elevation && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-primary/10 text-primary border-primary/30"
                                >
                                  {temple.elevation}
                                </Badge>
                              )}
                              <Badge
                                variant="outline"
                                className="text-xs bg-secondary/10 text-secondary border-secondary/30"
                              >
                                Built: {temple.built || temple.year}
                              </Badge>
                              {temple.isUNESCO && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-blue-500/20 text-blue-300 border-blue-400/30"
                                >
                                  <Crown className="h-3 w-3 mr-1" />
                                  UNESCO
                                </Badge>
                              )}
                              <Badge
                                variant="outline"
                                className="text-xs bg-accent/10 text-accent border-accent/30"
                              >
                                {temple.category}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              className="group-hover:scale-105 transition-transform bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
                              onClick={() => setSelectedTemple(index)}
                            >
                              <QrCode className="h-4 w-4 mr-2" />
                              Generate QR Code
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technical Requirements */}
        <div className="mt-16 p-6 bg-muted/10 rounded-lg border border-border">
          <h4 className="mb-4 text-center">System Requirements</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="text-center">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Mobile Device</p>
              <p>iOS 12+ or Android 8+</p>
            </div>
            <div className="text-center">
              <Eye className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <p className="font-medium">Camera Access</p>
              <p>Rear camera required</p>
            </div>
            <div className="text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-accent" />
              <p className="font-medium">Internet</p>
              <p>Stable connection needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {selectedTemple !== null && (
        <HistoryModal
          isOpen={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          site={temples[selectedTemple]}
        />
      )}
    </section>
  );
}
