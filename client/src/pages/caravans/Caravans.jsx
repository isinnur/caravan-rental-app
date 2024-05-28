import Caravan from '../../components/caravan/Caravan';
import styles from './caravans.module.css';
import { FaRegHeart } from 'react-icons/fa';
import Pagination from '@mui/material/Pagination';
import { createTheme } from '@mui/material/styles';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/loading/Loading';
import { Context } from '../../context/Contex';
import { useNavigate } from 'react-router-dom';

const Caravans = () => {
  const [totalCaravans, setTotalCaravans] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [fetch, setFetch] = useState({});
  const [page, setPage] = useState(1);
  const caravansPerPage = 9;
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(Context);

  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  console.log(user);

  const { state } = useLocation();
  const { selectedCity, startDate, endDate, peopleCount } = state || {};

  //add to local
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    const getSingleCaravan = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `/caravan/?page=${page}&limit=${caravansPerPage}`
        );

        // `/caravan/?page=${page}&limit=${caravansPerPage}&location=${selectedCity}&start=${startDate}&end=${endDate}&maxGuests=${peopleCount}`

        setFetch(res.data);
        console.log(res.data);
        setTotalCaravans(res.data.caravans);

        // Favori durumu güncelleniyor
        const favs = {};
        res.data.caravans.forEach((caravan) => {
          favs[caravan._id] = caravan.isFavorite;
        });
        setFavorites(favs);
        setLocation();
        window.scrollTo(0, 0);
        setTimeout(() => setIsLoading(false), 1000);
      } catch (error) {
        console.error('Error fetching caravan data: ', error);
        setIsLoading(false);
      }
    };
    getSingleCaravan();
  }, [page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const toggleFavorite = async (caravanId) => {
    if (!user || !user._id) {
      navigate('/login');
      return;
    }

    try {
      let updatedFavorites = { ...favorites };
      if (favorites[caravanId]) {
        await axios.delete(`/favorites/delete`, {
          data: { caravanId: caravanId },
        });
        delete updatedFavorites[caravanId];
      } else {
        await axios.post(`/favorites/add`, {
          caravanId: caravanId,
        });
        updatedFavorites[caravanId] = true;
      }
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles['caravans-container']}>
          {/* Sayfa başına karavan sayısı */}
          <span className={styles.result}>
            {fetch.totalCaravans > 20
              ? "20'den fazla karavan"
              : fetch.totalCaravans + ' Karavan Bulundu'}
          </span>
          <div className={styles.caravans}>
            {totalCaravans.map((caravan, index) => (
              <div className={styles.iconDiv} key={index}>
                <Link className={styles.links} to={`/caravan/${caravan._id}`}>
                  <Caravan totalCaravans={totalCaravans} {...caravan} />
                </Link>
                {/* Favori kısmı */}
                <div
                  onClick={() => toggleFavorite(caravan._id)}
                  className={styles['heartIcon-div']}
                >
                  {user && user._id && favorites[caravan._id] ? (
                    <FaHeart className={styles.favHeartIcon} />
                  ) : (
                    <FaRegHeart className={styles.heartIcon} />
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination
            className={styles.pagination}
            count={fetch.totalPage}
            color='primary'
            variant='outlined'
            size='large'
            page={page}
            onChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
};

export default Caravans;
