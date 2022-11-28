import { useEffect, useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { Modal } from '../../context/Modal';
import { updateShippingAddress } from '../../store/orders';

const errorMsgs = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: ''
};

const EditAddressModal = ({ shippingAddress, setShippingAddress, setMissingShipInfo }) => {
  const {
    firstName,
    lastName,
    address,
    city,
    state,
    zip,
    country
  } = shippingAddress;
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({ ...errorMsgs });
  const [firstNameEdit, setFirstNameEdit] = useState('');
  const [lastNameEdit, setLastNameEdit] = useState('');
  const [addressEdit, setAddressEdit] = useState('');
  const [cityEdit, setCityEdit] = useState('');
  const [stateEdit, setStateEdit] = useState('');
  const [zipEdit, setZipEdit] = useState('');
  const [countryEdit, setCountryEdit] = useState('');

  useEffect(() => {
    setFirstNameEdit(firstName);
    setLastNameEdit(lastName);
    setAddressEdit(address);
    setCityEdit(city);
    setStateEdit(state);
    setZipEdit(zip);
    setCountryEdit(country);
  }, [
    firstName,
    lastName,
    address,
    city,
    state,
    zip,
    country
  ]);

  const handleSubmit = async () => {
    const updatedAddress = {
      firstName: firstNameEdit,
      lastName: lastNameEdit,
      address: addressEdit,
      city: cityEdit,
      state: stateEdit,
      zip: zipEdit,
      country: countryEdit
    };
    const { success, errorMsgs } = await dispatch(updateShippingAddress(updatedAddress));
    if (success) {
      setShippingAddress({ ...updatedAddress });
      setShowModal(false);
      setMissingShipInfo(false);
    } else if (errorMsgs.length) {
      console.log(errorMsgs)
      errorMsgs.forEach((errorMsg) => {
        if (errorMsg.includes('firstName')) {
          setErrors((prev) => ({ ...prev, firstName: errorMsg.split(':')[1].trim() }));
        }
        if (errorMsg.includes('lastName')) {
          setErrors((prev) => ({ ...prev, lastName: errorMsg.split(':')[1].trim() }));
        }
        if (errorMsg.includes('address')) {
          setErrors((prev) => ({ ...prev, address: errorMsg.split(':')[1].trim() }));
        }
        if (errorMsg.includes('city')) {
          setErrors((prev) => ({ ...prev, city: errorMsg.split(':')[1].trim() }));
        }
        if (errorMsg.includes('state')) {
          setErrors((prev) => ({ ...prev, state: errorMsg.split(':')[1].trim() }));
        }
        if (errorMsg.includes('zip')) {
          setErrors((prev) => ({ ...prev, zip: errorMsg.split(':')[1].trim() }));
        }
        if (errorMsg.includes('country')) {
          setErrors((prev) => ({ ...prev, country: errorMsg.split(':')[1].trim() }));
        }
      });
    }
  };

  return (
    <>
      <div>
        <button
          className='edit-address-form__btn'
          onClick={() => setShowModal(true)}
        >
          <BsPencilSquare />
        </button>
        {showModal &&
          <Modal onClose={() => setShowModal(false)}>
            <div className='edit-address-form__container'>
              <div>
                <div className='edit-address-form__left'>
                  <div>
                    <span>First name:</span>
                    <input
                      value={firstNameEdit}
                      onChange={(e) => {
                        setFirstNameEdit(e.target.value);
                        if (errors.firstName) {
                          setErrors((prev) => ({ ...prev, firstName: '' }));
                        }
                      }}
                    />
                    {errors.firstName !== '' &&
                      <span className='edit-address__error-msg'>
                        {errors.firstName}
                      </span>
                    }
                  </div>
                  <div>
                    <span>Last name:</span>
                    <input
                      value={lastNameEdit}
                      onChange={(e) => {
                        setLastNameEdit(e.target.value);
                        if (errors.lastName) {
                          setErrors((prev) => ({ ...prev, lastName: '' }));
                        }
                      }}
                    />
                    {errors.lastName !== '' &&
                      <span className='edit-address__error-msg'>
                        {errors.lastName}
                      </span>
                    }
                  </div>
                  <div>
                    <span>Address:</span>
                    <textarea
                      value={addressEdit}
                      onChange={(e) => {
                        setAddressEdit(e.target.value);
                        if (errors.address) {
                          setErrors((prev) => ({ ...prev, address: '' }));
                        }
                      }}
                    />
                    {errors.address !== '' &&
                      <span className='edit-address__error-msg'>
                        {errors.address}
                      </span>
                    }
                  </div>
                </div>
                <div className='edit-address-form__right'>
                  <div>
                    <span>City:</span>
                    <input
                      value={cityEdit}
                      onChange={(e) => {
                        setCityEdit(e.target.value);
                        if (errors.city) {
                          setErrors((prev) => ({ ...prev, city: '' }));
                        }
                      }}
                    />
                    {errors.city !== '' &&
                      <span className='edit-address__error-msg'>
                        {errors.city}
                      </span>
                    }
                  </div>
                  <div>
                    <span>State:</span>
                    <input
                      value={stateEdit}
                      onChange={(e) => {
                        setStateEdit(e.target.value);
                        if (errors.state) {
                          setErrors((prev) => ({ ...prev, state: '' }));
                        }
                      }}
                    />
                    {errors.state !== '' &&
                      <span className='edit-address__error-msg'>
                        {errors.state}
                      </span>
                    }
                  </div>
                  <div>
                    <span>Zip code:</span>
                    <input
                      value={zipEdit}
                      onChange={(e) => {
                        setZipEdit(e.target.value);
                        if (errors.zip) {
                          setErrors((prev) => ({ ...prev, zip: '' }));
                        }
                      }}
                    />
                    {errors.zip !== '' &&
                      <span className='edit-address__error-msg'>
                        {errors.zip}
                      </span>
                    }
                  </div>
                  <div>
                    <span>Country:</span>
                    <input
                      value={countryEdit}
                      onChange={(e) => {
                        setCountryEdit(e.target.value);
                        if (errors.country) {
                          setErrors((prev) => ({ ...prev, country: '' }));
                        }
                      }}
                    />
                    {errors.country !== '' &&
                      <span className='edit-address__error-msg'>
                        {errors.country}
                      </span>
                    }
                  </div>
                </div>
              </div>
              <div className='edit-address-form__btns'>
                <button
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        }
      </div>
    </>
  );
};

export default EditAddressModal;
