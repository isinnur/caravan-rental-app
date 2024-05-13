import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // ana css dosyası
import 'react-date-range/dist/theme/default.css'; // tema css dosyası
import axios from 'axios';
import { RiCaravanLine } from 'react-icons/ri';
import { PiGasPump } from 'react-icons/pi';
import { IoSettingsOutline } from 'react-icons/io5';
import { GoPeople } from 'react-icons/go';
import { IoMdStar } from 'react-icons/io';
import { IoMdShare } from 'react-icons/io';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { MdExpandMore } from 'react-icons/md';
import Comments from '../../components/comments/Comments';
import { addDays, differenceInDays } from 'date-fns';
import styles from './singleCaravan.module.css';
import { useParams } from 'react-router-dom';
import { color } from '@mui/system';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
// import { trTR } from '@mui/lab/locale'; // Türkçe dil desteği
import { LuDot } from 'react-icons/lu';

const SingleCaravan = () => {
  const { id } = useParams(); //url'den id alır
  const [state, setState] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [caravanData, setCaravanData] = useState(null);
  const [selectedDate, setSelectedDate] = useState([null, null]);
  //kullanıcının seçtiği tarih aralığınu tutar
  //başta herhangi bir tarih yok -> null

  const [selectedDateRangeString, setSelectedDateRangeString] = useState('');
  const [days, setDays] = useState(0);
  const [startDay, setStartDay] = useState([]);
  const [endDay, setEndDay] = useState([]);

  const [showSelectedDateRange, setShowSelectedDateRange] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde sayfanın en başına git
    window.scrollTo(0, 0);
  }, []); // Boş bağımlılık dizisi, yalnızca bileşen yüklendiğinde bir kere çalışmasını sağlar

  useEffect(() => {
    const getSingleCaravan = async () => {
      try {
        const res = await axios.get(`/caravan/${id}`);
        setCaravanData(res.data);
      } catch (error) {
        console.error('Error fetching caravan data: ', error);
      }
    };
    getSingleCaravan();
  }, []);

  //selected date için
  useEffect(() => {
    //selectedDate seçildiğinde çalışan:
    if (selectedDate[0] && selectedDate[1]) {
      //ilk ve son tarih seçildiyse
      const startDate = selectedDate[0];
      setStartDay(startDate.format('DD/MM/YYYY'));
      const endDate = selectedDate[1];
      setEndDay(endDate.format('DD/MM/YYYY'));
      //tarih aralığındaki gün sayısını hesaplar:
      const days = endDate.diff(startDate, 'day'); // Tarih aralığındaki gün sayısını dayjs ile hesapla
      setDays(days);
      // String formatında tarih aralığını ve gün sayısını ayarlar
      setSelectedDateRangeString(
        `${startDate.format('DD.MM.YYYY')} - ${endDate.format(
          'DD.MM.YYYY'
        )} (${days} gün)`
      );
    } else {
      //seçilmdiyse string boş
      setSelectedDateRangeString('');
    }
  }, [selectedDate]);

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const disabledDates =
    caravanData?.notAvailableDates.map((date) => ({
      start: new Date(date.start),
      end: new Date(date.end),
    })) || [];

  disabledDates.forEach((date) => {
    date.start.setDate(date.start.getDate() - 1);
  });

  const isDisabledDate = (date) => {
    // Tarihin müsait olmayan günler arasında olup olmadığını kontrol et
    return disabledDates.some((disabledDate) =>
      isDateInRange(date, disabledDate.start, disabledDate.end)
    );
  };

  const isDateInRange = (date, startDate, endDate) => {
    return dayjs(date).isBetween(startDate, endDate, null, '[]');
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setShowSelectedDateRange(true);

    // 1 saniye sonra showSelectedDateRange state'ini false olarak güncelle
    setTimeout(() => {
      setShowSelectedDateRange(false);
    }, 1000); // 1 saniye
  };

  console.log(caravanData);

  return (
    <div className={`${styles['single-container']} fadeIn`}>
      <div className={styles['caravan-info']}>
        <div className={styles.icons}>
          <div className={styles['right-side']}>
            <IoMdShare className={styles.shareIcon} />
            <p>Paylaş</p>
          </div>
          <div className={styles['right-side']}>
            {isFavorited ? (
              <FaHeart
                onClick={toggleFavorite}
                className={styles.favHeartIcon}
              />
            ) : (
              <FaRegHeart
                onClick={toggleFavorite}
                className={styles.heartIcon}
              />
            )}
            <p>Ekle</p>
          </div>
        </div>
      </div>

      <div className={styles['caravan-images']}>
        <img
          className={styles['main-image']}
          src='https://images.unsplash.com/photo-1592351763700-b9b35a6465ea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt=''
        />
        <div className={styles['images-container']}>
          {[1, 2, 3, 4].map((index) => (
            <img
              key={index}
              className={styles['images']}
              src='https://images.unsplash.com/photo-1592351763700-b9b35a6465ea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              alt=''
            />
          ))}
        </div>
      </div>

      <div className={styles['description-section']}>
        <div className={styles['caravan-left-side']}>
          <span>
            {caravanData.location} - {caravanData?.title}
          </span>
          <ul className={styles.features}>
            <li>
              <RiCaravanLine /> <p>{caravanData?.type}</p>
            </li>
            <li>
              <PiGasPump /> <p>{caravanData?.fuel}</p>
            </li>
            <li>
              <IoSettingsOutline /> <p>{caravanData?.gear}</p>
            </li>
            <li>
              <GoPeople /> <p>{caravanData?.maxGuests} Kişilik</p>
            </li>
          </ul>

          <ul className={styles.review}>
            <li>
              <IoMdStar className={styles['star-icon']} /> 4,83 · 1,800
              değerlendirme
            </li>
          </ul>

          <div className={styles.profile}>
            <div className={styles['profile-pic']}>
              <img
                className={styles['owner-profile-pic']}
                src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                alt=''
              />
            </div>
            <div className={styles.owner}>
              Karavan Sahibi: {caravanData?.owner}
            </div>
          </div>

          <div className={styles.line}></div>

          <div className={styles.description}>
            <span>AÇIKLAMA</span>
            <ul>
              {caravanData?.description.map((desc, index) => (
                <li key={index} className={styles.caravanDesc}>
                  {' '}
                  <LuDot /> {desc}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.line}></div>

          <div className={styles.calendar}>
            {/* Tarih seçiniz yazısı */}
            {!selectedDate[0] && !selectedDate[1] && (
              <div className={styles.selectedDateRange}>Tarih seçiniz</div>
            )}

            {/* Tarihlerin yer alacağı bölüm */}
            <div className={styles.selectedDatesContainer}>
              {selectedDate[0] && selectedDate[1] && (
                <div
                  className={`${styles.selectedDateRange} ${
                    showSelectedDateRange ? styles.show : ''
                  }`}
                >
                  {selectedDateRangeString}
                </div>
              )}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangeCalendar
                  className={styles.customCalendar}
                  value={selectedDate}
                  onChange={handleDateChange}
                  shouldDisableDate={(date) => {
                    return isDisabledDate(date);
                  }}
                  disablePast
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>
        <div className={styles['caravan-right-side']}>
          <div className={styles.paymentContainer}>
            <div className={styles['total-info']}>
              <p className={styles.price}>
                {caravanData?.dailyPrice}₺<span>{days} gün</span>
              </p>
              <p className={styles['total-rating']}>
                <IoMdStar className={styles.icon} />
                4.83 · 1,800 değerlendirme
              </p>
            </div>
            <div className={styles['check-container']}>
              <div className={styles.reservation}>
                <div className={styles.check}>
                  <div className={styles.checkin}>
                    <span>BAŞLANGIÇ</span>
                    <span> {startDay} </span>
                  </div>
                  <div className={styles.checkout}>
                    <span>BİTİŞ</span>
                    <span> {endDay} </span>
                  </div>
                </div>
                <div className={styles.guest}>
                  <div className={styles['select-guests']}>
                    <span>MİSAFİR</span>
                    <span>1 misafir</span>
                  </div>
                  <div className={styles.moreIcon}>
                    {' '}
                    <MdExpandMore className={styles.moreIcon} />{' '}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.button}>
              <button className={styles['reservation-button']} type='submit'>
                Devam et
              </button>
              <span>Henüz ücretlendirilmeyeceksiniz</span>
            </div>
            <div className={styles['caravan-payment']}>
              <div className={styles['payment-info']}>
                <div className={styles['total-price-info']}>
                  {caravanData?.dailyPrice}₺ x {days} gün
                </div>
                <div className={styles['total-price']}>
                  {caravanData?.dailyPrice * days}₺
                </div>
              </div>
              <div className={styles['payment-line']}></div>
              <div className={styles['before-tax']}>
                <div className={styles['total-price-info']}>
                  Vergi̇ öncesi̇ toplam
                </div>
                <div className={styles['total-price']}>
                  {' '}
                  {caravanData?.dailyPrice}₺
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.line}></div>
      {/* COMMENT SECTION */}
      <Comments />
    </div>
  );
};

export default SingleCaravan;
