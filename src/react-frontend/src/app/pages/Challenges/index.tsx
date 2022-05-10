import SearchChallenges from './pages/SearchChallenges';
import SaveChallenge from './pages/SaveChallenge';
import DetailsChallenge from './pages/DetailsChallenge';

type ChallengePageProps = {
  Details: typeof DetailsChallenge,
  Save: typeof SaveChallenge;
  Search: typeof SearchChallenges;
};

const ChallengePage: ChallengePageProps = {
  Details: DetailsChallenge,
  Save: SaveChallenge,
  Search: SearchChallenges,
};

export default ChallengePage;
