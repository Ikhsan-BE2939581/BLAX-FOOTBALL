"use client";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/atoms/SearchBar";
import Navbar from "@/components/organisms/Navbar";
import { useNotifications } from "@/components/organisms/NotificationContainer";
import { formatCurrency } from "@/lib/helper";
import { Schedule } from "@/types/schedule";
import { formatDate } from "@/utils/helpers";
import { scheduleService } from "@/utils/schedule";
import BookModal from "@/components/molecules/BookModal";
import { Calendar, Clock, Eye, MapPin, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

export default function SchedulePage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("All Venues");
  const [selectedType, setSelectedType] = useState("All Types");
  const [sortBy, setSortBy] = useState("date");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  const matchesData = useMemo(
    () =>
      schedules.map((schedule) => ({
        id: schedule.id.toString(),
        name: schedule.name,
        date: schedule.date,
        time: schedule.time,
        venue: schedule.venue,
        openSlots: schedule.openSlots,
        bookedSlots: schedule.bookedSlots,
        totalSlots: schedule.totalSlots,
        feePlayer: Number(schedule.feePlayer),
        feeGk: Number(schedule.feeGk),
        type: schedule.typeEvent,
        typeMatch: schedule.typeMatch,
        facilities: schedule.facilities,
        description: `Pertandingan ${schedule.typeMatch.toLowerCase()} untuk semua level pemain`,
        image: schedule.imageUrl,
      })),
    [schedules]
  );

  // Get unique venues and types for filter options
  const venues = useMemo(
    () => ["All Venues", ...new Set(schedules.map((s) => s.venue))],
    [schedules]
  );
  const types = useMemo(
    () => ["All Types", ...new Set(schedules.map((s) => s.typeEvent))],
    [schedules]
  );

  // Filter and sort matches
  const filteredAndSortedMatches = useMemo(() => {
    let filtered = matchesData.filter((match) => {
      const matchesSearch =
        !searchQuery ||
        match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVenue =
        selectedVenue === "All Venues" || match.venue === selectedVenue;
      const matchesType =
        selectedType === "All Types" || match.type === selectedType;

      return matchesSearch && matchesVenue && matchesType;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "venue":
          return a.venue.localeCompare(b.venue);
        case "fee":
          return a.feePlayer - b.feePlayer;
        case "availability":
          return Number(b.openSlots) - Number(a.openSlots);
        default:
          return 0;
      }
    });

    return filtered;
  }, [matchesData, searchQuery, selectedVenue, selectedType, sortBy]);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      const result = await scheduleService.getSchedules();
      if (result) setSchedules(result);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      showError("Failed to load schedules", "Please try refreshing the page");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilter = (filterType: string) => {
    switch (filterType) {
      case "search":
        setSearchQuery("");
        break;
      case "venue":
        setSelectedVenue("All Venues");
        break;
      case "type":
        setSelectedType("All Types");
        break;
    }
  };

  const handleDetailClick = (matchId: string) => {
    router.push(`/schedule/${matchId}`);
  };

  const handleBooking = (schedule: any) => {
    setIsBookModalOpen(true);
    setSelectedSchedule(schedule);
  };

  // Loading skeleton
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-green-200 h-full animate-pulse">
      <div className="flex flex-col h-full">
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <div className="absolute top-4 right-4">
            <div className="bg-gray-300 rounded-full px-3 py-1 w-16 h-6"></div>
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="bg-gray-300/80 backdrop-blur-sm border border-gray-300/20 p-3 rounded-2xl">
              <div className="bg-gray-400 h-6 w-20 rounded mb-1"></div>
              <div className="bg-gray-400 h-3 w-16 rounded mb-2"></div>
              <div className="bg-gray-400 h-6 w-20 rounded mb-1"></div>
              <div className="bg-gray-400 h-3 w-12 rounded"></div>
            </div>
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-xl mr-3"></div>
              <div>
                <div className="bg-gray-300 h-5 w-32 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-24 rounded"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="space-y-2 mb-4">
              <div className="bg-gray-200 h-4 w-full rounded"></div>
              <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
              <div className="bg-gray-200 h-4 w-4/6 rounded"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <div className="bg-gray-200 h-4 w-4 rounded mr-2"></div>
                <div className="bg-gray-200 h-4 w-40 rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-200 h-4 w-4 rounded mr-2"></div>
                <div className="bg-gray-200 h-4 w-36 rounded"></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
              <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
              <div className="bg-gray-200 h-6 w-14 rounded-full"></div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-300 h-2 rounded-full w-3/5"></div>
              </div>
              <div className="bg-gray-200 h-3 w-16 rounded mt-1"></div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 space-x-2">
              <div className="bg-gray-200 h-9 flex-1 rounded"></div>
              <div className="bg-gray-300 h-9 flex-1 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-4">
              Jadwal Pertandingan
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Temukan dan daftar untuk pertandingan futsal dan mini soccer yang
              tersedia. Pilih jadwal yang sesuai dengan waktu dan preferensi
              Anda.
            </p>
          </div>

          {/* Skeleton Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-emerald-100 animate-pulse"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-gray-200 rounded-lg w-12 h-12"></div>
                  <div className="ml-4">
                    <div className="bg-gray-200 h-4 w-20 rounded mb-2"></div>
                    <div className="bg-gray-300 h-6 w-8 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton Filter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-100 p-6 mb-8 animate-pulse">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="bg-gray-200 h-10 rounded-lg"></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-gray-200 h-10 w-40 rounded-lg"></div>
                <div className="bg-gray-200 h-10 w-32 rounded-lg"></div>
                <div className="bg-gray-200 h-10 w-32 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Header */}
          <div className="text-center mb-8 bg-white/80 backdrop-blur-sm border border-emerald-100 p-8 rounded-2xl shadow-lg">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-4">
              Jadwal Pertandingan
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Temukan dan daftar untuk pertandingan futsal dan mini soccer yang
              tersedia. Pilih jadwal yang sesuai dengan waktu dan preferensi
              Anda.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-md">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Total Schedules
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {schedules.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-md">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Available Slots
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {matchesData.reduce(
                      (sum, schedule) => sum + Number(schedule.openSlots),
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-md">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">
                    Active Venues
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {new Set(schedules.map((s) => s.venue)).size}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-violet-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg shadow-md">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">This Week</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {
                      schedules.filter((s) => {
                        const scheduleDate = new Date(s.date);
                        const now = new Date();
                        const weekFromNow = new Date(
                          now.getTime() + 7 * 24 * 60 * 60 * 1000
                        );
                        return (
                          scheduleDate >= now && scheduleDate <= weekFromNow
                        );
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  placeholder="Search by venue, type, or description..."
                  onSearch={handleSearch}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Venue Select */}
                <div className="min-w-[160px]">
                  <select
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 text-sm"
                  >
                    {venues.map((venue) => (
                      <option key={venue} value={venue}>
                        {venue}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Select */}
                <div className="min-w-[120px]">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 text-sm"
                  >
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Select */}
                <div className="min-w-[120px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 text-sm"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="venue">Sort by Venue</option>
                    <option value="fee">Sort by Price</option>
                    <option value="availability">Sort by Availability</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery ||
              selectedVenue !== "All Venues" ||
              selectedType !== "All Types") && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mr-2">Active filters:</p>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                    Search: {searchQuery}
                    <button
                      onClick={() => clearFilter("search")}
                      className="ml-1 hover:text-emerald-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedVenue !== "All Venues" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                    Venue: {selectedVenue}
                    <button
                      onClick={() => clearFilter("venue")}
                      className="ml-1 hover:text-emerald-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedType !== "All Types" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                    Type: {selectedType}
                    <button
                      onClick={() => clearFilter("type")}
                      className="ml-1 hover:text-emerald-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-slate-600 bg-white/70 backdrop-blur-sm border border-emerald-100 p-4 rounded-2xl shadow-md">
              Showing {filteredAndSortedMatches.length} of {matchesData.length}{" "}
              schedules
            </p>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-emerald-200 h-full hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex flex-col h-full">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={match.image}
                      alt={`${match.type} match`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="default"
                        className="flex items-center bg-white/95 backdrop-blur-sm text-emerald-700 border border-emerald-200 shadow-md"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        {match.openSlots}/{match.totalSlots}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white bg-black/30 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-lg">
                      <div className="text-2xl font-bold">
                        {formatCurrency(match.feePlayer)}
                      </div>
                      <div className="text-sm opacity-90">Player Fee</div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(match.feeGk)}
                      </div>
                      <div className="text-sm opacity-90">GK Fee</div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                          <Calendar className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 line-clamp-1 hover:text-emerald-700 transition-colors">
                            {match.name}
                          </h3>
                          <p className="text-slate-600 text-sm line-clamp-1">
                            {match.type} • {match.typeMatch}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <p className="text-slate-700 leading-relaxed mb-4 line-clamp-3 flex-1">
                        {match.description}
                      </p>

                      {/* Match Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                          {formatDate(match.date)} • {match.time}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                          {match.venue}
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {match.facilities.slice(0, 3).map((facility, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs border border-emerald-200"
                          >
                            {facility.name}
                          </span>
                        ))}
                        {match.facilities.length > 3 && (
                          <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded-full text-xs border border-slate-200">
                            +{match.facilities.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (Number(match.bookedSlots) /
                                  Number(match.totalSlots)) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {Math.round(
                            (Number(match.bookedSlots) /
                              Number(match.totalSlots)) *
                              100
                          )}
                          % terisi
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDetailClick(match.id)}
                          className="flex-1 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-600 border-emerald-200"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Detail
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleBooking(match)}
                          disabled={Number(match.openSlots) === 0}
                          className="flex-1 shadow-md hover:shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        >
                          {Number(match.openSlots) === 0 ? "Penuh" : "Book Now"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredAndSortedMatches.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-emerald-100 shadow-lg">
                <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No schedules found
                </h3>
                <p className="text-slate-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedVenue("All Venues");
                    setSelectedType("All Types");
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Book Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setSelectedSchedule(null);
        }}
        schedule={selectedSchedule}
        scheduleId={selectedSchedule?.id || null}
      />
    </>
  );
}