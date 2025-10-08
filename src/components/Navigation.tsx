import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User, Crown, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  userProfile?: {
    subscription_tier: string;
    display_name?: string;
  };
}

export default function Navigation({ userProfile }: NavigationProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="gradient-primary border-b border-primary-foreground/20 px-4 py-3 shadow-elevated">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-primary-foreground drop-shadow-lg" />
            <h1 className="text-xl font-bold text-primary-foreground">Life Budget Builder</h1>
          </div>
          <p className="text-xs text-primary-foreground/80 ml-8">Build Your Future, One Decision at a Time</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {userProfile?.subscription_tier === 'premium' && (
                <Badge variant="secondary" className="gradient-premium text-white shadow-premium">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-primary-foreground/20">
                    <Avatar className="h-8 w-8 ring-2 ring-primary-foreground/30">
                      <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground font-bold">
                        {userProfile?.display_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{userProfile?.display_name || 'User'}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg">
              <Link to="/under-construction">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}