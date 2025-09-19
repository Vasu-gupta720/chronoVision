import { useState, useEffect } from "react";
import { SiteCard } from "./SiteCard";
import { SiteModal } from "./SiteModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { toast } from "sonner";
import { getFeaturedSites, type HeritageSite } from "../data/heritage-sites";

interface FeaturedSitesProps {
  onARViewClick?: (siteId?: string) => void;
}

export function FeaturedSites({ onARViewClick }: FeaturedSitesProps) {
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuredSites, setFeaturedSites] = useState<HeritageSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedSites = async () => {
      setIsLoading(true);
      try {
        const sites = await getFeaturedSites();
        setFeaturedSites(sites);
      } catch (error) {
        console.error("Failed to fetch featured sites:", error);
        toast.error("Could not load featured sites.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedSites();
  }, []); // The empty array ensures this runs only once.

  const handleSiteClick = (site: HeritageSite) => {
    setSelectedSite(site);
    setIsModalOpen(true);
  };

  const handleARViewClick = (siteId?: string) => {
    if (onARViewClick) {
      const site = siteId
        ? featuredSites.find((s) => s.id === parseInt(siteId, 10))
        : selectedSite;
      onARViewClick(siteId || String(selectedSite?.id));
      toast.success(`Launching AR experience for ${site?.title}...`, {
        description: "Prepare your device for an immersive AR journey.",
      });
    }
  };

  return (
    <>
      {/* Hero Section for Sites Page */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent animate-gradient p-3">
              Indian Heritage Sites
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              Explore India's magnificent forts, palaces, temples, and monuments
              through immersive digital experiences
            </p>
            <div className="flex justify-center space-x-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <div className="text-2xl font-bold text-accent">
                  {featuredSites.length}
                </div>
                <div className="text-sm text-gray-300">Sacred Sites</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <div className="text-2xl font-bold text-secondary">
                  {featuredSites.filter((site) => site.isUNESCO).length}
                </div>
                <div className="text-sm text-gray-300">UNESCO Sites</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-gray-300">Years History</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sites Section */}
      <section id="sites" className="py-16 bg-card relative z-10 shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Explore Cultural Treasures</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each heritage site holds centuries of history, architectural
              mastery, and cultural significance. Click on any site to discover
              its unique story and timeless legacy.
            </p>
          </div>

          <div className="relative px-4 py-8">
            <Carousel
              className="w-full max-w-6xl mx-auto overflow-visible"
              opts={{
                align: "start",
                loop: false,
                dragFree: true,
                containScroll: "trimSnaps",
                duration: 25,
                skipSnaps: false,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4 overflow-visible cursor-grab active:cursor-grabbing smooth-scroll-container">
                {featuredSites.map((site) => (
                  <CarouselItem
                    key={site.id}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 py-4"
                  >
                    <div className="px-2 h-full">
                      <SiteCard
                        title={site.title}
                        location={site.location}
                        year={site.year}
                        image={site.image}
                        description={site.description}
                        category={site.category}
                        isUNESCO={site.isUNESCO}
                        onClick={() => handleSiteClick(site)}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </div>

        <SiteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          site={selectedSite}
          onARViewClick={handleARViewClick}
        />
      </section>
    </>
  );
}
