import SearchChallenges from './pages/SearchChallenges';
import SaveChallenge from './pages/SaveChallenge';

type ChallengePageProps = {
  Save: typeof SaveChallenge;
  Search: typeof SearchChallenges;
};

const ChallengePage: ChallengePageProps = {
  Save: SaveChallenge,
  Search: SearchChallenges,
};

export default ChallengePage;
