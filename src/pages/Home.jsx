import { useQuery } from 'react-query';
import { getUsers } from '../api';

function Home() {
  const { isError, data, error, isFetching } = useQuery('posts', async () => {
    return await getUsers({ pageNumber: 0, pageSize: 10 });
  });
  console.log(data);
  if (isFetching) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return <div className="bg-white">Hello World</div>;
}
export default Home;
