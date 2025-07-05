import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Search, UserPlus } from "lucide-react";
import { useGetUsersByUsername } from "@/hooks/server/user/useGetUsersByUsername";
import { useDebounce } from "@/hooks/use-debounce";

interface User {
  id: string;
  username: string;
  email: string;
  photo: string;
}

interface MemberSearchProps {
  selectedMembers: User[];
  onMemberSelect: (member: User) => void;
  onMemberRemove: (memberId: string) => void;
}

export function MemberSearch({
  selectedMembers,
  onMemberSelect,
  onMemberRemove,
}: MemberSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: users, isLoading } = useGetUsersByUsername(
    debouncedSearch.length >= 2 ? debouncedSearch : ""
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter out already selected members
  const availableUsers =
    users?.filter(
      (user) => !selectedMembers.some((member) => member.id === user.id)
    ) || [];

  const handleUserSelect = (user: User) => {
    onMemberSelect(user);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleInputFocus = () => {
    if (debouncedSearch.length >= 2) {
      setIsDropdownOpen(true);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.length >= 2) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Search Members</label>
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={handleInputFocus}
              className="pl-10"
            />
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-zinc-400">Loading...</div>
              ) : availableUsers.length > 0 ? (
                <div className="py-1">
                  {availableUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full px-4 py-2 text-left hover:bg-zinc-800 flex items-center gap-3"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.photo} alt={user.username} />
                        <AvatarFallback>
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm text-zinc-100">
                          {user.username}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {user.email}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : debouncedSearch.length >= 2 ? (
                <div className="p-4 text-center text-zinc-400">
                  No users found
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Selected Members */}
      {selectedMembers.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Selected Members</label>
          <div className="space-y-2">
            {selectedMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={member.photo} alt={member.username} />
                    <AvatarFallback>
                      {member.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm text-zinc-100">
                      {member.username}
                    </div>
                    <div className="text-xs text-zinc-400">{member.email}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMemberRemove(member.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
