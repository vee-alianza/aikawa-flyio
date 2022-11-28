import './index.css'

const Homepage = () => {
    return (
        <>
            <div className='gallery__container'>
                <h1>WELCOME!</h1>
                <div className='gallery' >
                    <div className='grid-column__images' id='gallery__image--1' >
                        <img className='gallery__img' src='https://user-images.githubusercontent.com/92604480/174190629-1710fb6a-aa28-4e2a-83e1-fe8028528d28.jpg' alt='' />
                    </div>
                    <div className='grid-column__images' id='gallery__image--2'>
                        <img className='gallery__img' src='https://user-images.githubusercontent.com/92604480/174229702-28917f5e-0ed1-489b-992b-f848e4a8e41a.jpg' alt='' />
                    </div>
                    <div className='grid-column__images' id='gallery__image--3'>
                        <img className='gallery__img' src='https://user-images.githubusercontent.com/92604480/174193457-07ea12cb-c1f7-4f1d-ad28-5475bcb0fee6.jpg' alt='' />
                    </div>
                    <div className='grid-column__images' id='gallery__image--4'>
                        <img className='gallery__img' src='https://user-images.githubusercontent.com/92604480/174191131-83427f59-7fb5-46b0-8c5e-51d4435236d4.jpg' alt='' />
                    </div>
                    <div className='grid-column__images' id='gallery__image--5'>
                        <img className='gallery__img' src='https://user-images.githubusercontent.com/92604480/174191250-66b93d93-dd28-44dd-9e0e-44b7cc080cba.jpg' alt='' />
                    </div>
                    <div className='grid-column__images' id='gallery__image--6'>
                        <img className='gallery__img' src='https://user-images.githubusercontent.com/92604480/174192338-ea77b5fe-b362-42bc-876c-0a48b6bb36ad.jpg' alt='' />
                    </div>
                    <div className='grid-column__images' id='gallery__item--7'>
                        <img className='gallery__img' src='https://user-images.githubusercontent.com/92604480/174193503-76b12e32-2f17-4ed9-9e1a-9d8a4494a678.jpg' alt='' />
                    </div>
                    <div className='grid-column__images' id='gallery__item--8'>

                        <img className='gallery__img' src='https://user-images.githubusercontent.com/92604480/174191121-a4e3eb93-3a26-4189-8589-b4e61774721f.jpg' alt='' />
                    </div>
                    <div className='grid-column__images' id='gallery__item--9'>
                        <img className='gallery__img' src='https://user-images.githubusercontent.com/92604480/174193538-74e13441-0369-4d44-9e57-7bac95ee73f2.jpg' alt='' />
                    </div>
                </div>
                <div className='homepage__footer'>
                    <img src='https://user-images.githubusercontent.com/92604480/174232110-dcbd5e47-2ecc-4d67-9969-a9f21551bd89.png' alt='homepage__footer'></img>
                </div>
            </div>
        </>
    )
}

export default Homepage;
