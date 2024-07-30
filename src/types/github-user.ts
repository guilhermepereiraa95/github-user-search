export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  location: string;
  public_repos: number;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_gists: number;
  email?: string;
  repos: GitHubRepo[]; 
}

export interface GitHubRepo {
  fork: any;
  id: number;
  name: string;
  forked: boolean;
  description: string;
  language?: string;
  forks_count: number;
  updated_at: string; 
}
