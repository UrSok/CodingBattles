import Index from './pages/Index';
import Save from './pages/Save';
import Details from './pages/Details';

type ChallengePagesProps = {
  Index: typeof Index;
  Details: typeof Details;
  Save: typeof Save;
};

const ChallengePages: ChallengePagesProps = {
  Index: Index,
  Details: Details,
  Save: Save,
};

export default ChallengePages;
