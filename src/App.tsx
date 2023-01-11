import "./styles.css";
import { useState, useEffect, useCallback } from 'react'

type Geotype = {
  lat: string;
  lng: string;
}

interface UserType {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: Geotype
    },
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase:string;
        bs: string;
    },
}

interface User {
  user: UserType;
  onClick: (e:React.MouseEvent<HTMLDivElement, MouseEvent> ,val: Geotype)=> void
}

const UserData = ({ user, onClick }: User)=> {
  const {id, name, company, address} = user
  const formattedAddr = `${address?.suite}, ${address?.street}, ${address?.zipcode}`
  return (
    <div className="card" key={id} onClick={(e)=> onClick?.(e, address?.geo)}>
        <div className="card-name">{name}</div>
        <div className="card-body">
         <div className="card-company">Company: {company.name}</div>
         <div className="card-company">Address: {formattedAddr}</div>
        </div>
    </div>
);
}


export default function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<UserType[]>([])

  const fetchData = useCallback(async () => {
    try{
        setIsLoading(true)
        const response = await fetch("https://jsonplaceholder.typicode.com/users")
        const result = await response.json()
        setUsers(result)
    }catch(err){
        console.log('error in fetching data--->', err)
        setUsers([])
    }
    finally{
      setIsLoading(false)
    }
  },[])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onClick = useCallback((event, geo: Geotype)=> {
    event.preventDefault();

    if(!geo){
      alert('Geolocation data not available at the moment')
      return
    }
    const {lat, lng} = geo
    const url = "https://maps.google.com?q="+lat+","+lng
    window.open(url, "_blank");
  },[])


  return (
    <div className="App">
       { isLoading 
          ? <p>Loading...</p>
          :  users && users?.length > 0 ? users.map((user, index) => (
              <div key={index}>
                <UserData user={user} onClick={onClick}/>
              </div>
          )) : <p> No users available at this time</p>
        }
    </div>
  );
}
