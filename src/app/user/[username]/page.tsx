import api from '@/api/api';
import { GitHubRepo, GitHubUser } from '@/types/github-user';
import Image from 'next/image';
import { FiBook, FiUsers, FiStar, FiMail, FiCircle, FiShare2 } from 'react-icons/fi';

interface UserPageProps {
  params: { username: string };
}

const UserPage = async ({ params }: UserPageProps) => {
  const { username } = params;
  let userData: GitHubUser | null = null;
  let repos: GitHubRepo[] = [];
  let error: string | null = null;

  try {
    const userResponse = await api.get<GitHubUser>(username);
    userData = userResponse.data;
    
    const reposResponse = await api.get<GitHubRepo[]>(`${username}/repos`);
    repos = reposResponse.data;
  } catch (err: any) {
    error = err.message;
  }

  if (error) return <p className="text-red-500 text-center">Error fetching data: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <section className="flex flex-wrap justify-center mt-5">
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white rounded-lg shadow-md p-4">
          <Image
            src={userData?.avatar_url || ''}
            alt="Github Pic"
            width={128}
            height={128}
            className="rounded-full mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-center">{userData?.name}</h3>
          <p className="text-center text-gray-600">{userData?.login}</p>
          <a
            className="block text-center bg-green-500 text-white py-2 px-4 rounded mt-2 hover:bg-green-600"
            href={userData?.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow
          </a>
          <p className="text-center mt-2">
            <strong>@{userData?.login}</strong>
          </p>
          <p className="text-center mt-2 text-gray-600">
            <FiUsers className="inline mr-1" /> {userData?.followers} <span className="text-muted">followers</span> - {userData?.following} <span className="text-muted">following</span> - <FiStar className="inline mr-1" /> {userData?.public_gists}
          </p>
          <p className="text-center mt-2 text-gray-600">
            <FiMail className="inline mr-1" /> {userData?.email ? userData.email : 'E-mail not provided'}
          </p>
          <hr className="my-4" />
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4 bg-white rounded-lg shadow-md p-4 space-y-4">
          <h4 className="text-center pt-3 text-lg font-semibold">
            <FiBook className="inline mr-2" /> Repositories
            <span className="border rounded-full px-2 py-1 bg-gray-200 ml-2">{userData?.public_repos}</span>
          </h4>
          <ul className="space-y-4">
            {repos.length > 0 ? (
              repos.map((repo) => (
                <li className="border border-gray-200 p-4 rounded-lg shadow-sm" key={repo.id}>
                  <h4 className="text-primary text-lg font-semibold">{repo.name}</h4>
                  <p className="text-gray-600">{repo.fork ? 'Forked' : 'Not Forked'}</p>
                  <p className="text-gray-600">{repo.description || 'No description'}</p>
                  <p className="text-gray-600 mt-2 flex space-x-4">
                    <span className="flex items-center">
                      <FiCircle className="mr-1" />
                      {repo.language || 'Not provided'}
                    </span>
                    <span className="flex items-center">
                      <FiShare2 className="mr-1" />
                      {repo.forks_count} forks
                    </span>
                    <span className="flex items-center">
                      Updated on {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </p>
                </li>
              ))
            ) : (
              <p className="text-gray-600 text-center">No repositories found.</p>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default UserPage;
