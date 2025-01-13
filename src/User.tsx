import * as React from 'react'
import Search from './Search'
const getUser = () => {
  return Promise.resolve({ id: '1', name: 'Robin' });
};

function User() {
  const [search, setSearch] = React.useState('');
  const [user, setUser] = React.useState<{ id: string; name: string}|null>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      const user:{ id: string; name: string} = await getUser();
      setUser(user);
    };

    loadUser();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  return (
    <div>
      {user ? <p>Signed in as {user.name}</p> : null}

      <Search value={search} onChange={handleChange}>
        Search:
      </Search>

      <p>Searches for {search ? search : '...'}</p>
    </div>
  );
}

export default User;