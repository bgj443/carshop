import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Addcar from './Addcar';
import Editcar from './Editcar';

export default function Carlist() {
    const [cars, setCars] = useState([]);

    useEffect(() => fetchData(), []);

    //haetaan tiedot herokussa olevasta tietokannasta
    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
            .then(response => response.json())
            .then(data => setCars(data._embedded.cars))
    }

    //snackbar
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }
    //snackbar

    //Delete car funktio
    const deleteCar = (link) => {
        if (window.confirm('Are you sure?/ Oletko varma?'))
            fetch(link, { method: 'DELETE' })
                .then(res => fetchData()) 
                .catch(err => console.err(err))
                //seuraavaksi deleteCar aktivoi snackbarin funktion (handleClick), joka vaihtaa setOpen tilaksi (True)
                .then(res => handleClick());
                 //setOpen true johtaa siihen, että snackbar renderöidään hetkeksi näkyville

    }
    //savecar funktio
    const saveCar = (car) => {
        fetch('https://carstockrest.herokuapp.com/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
    })
    .then(res => fetchData())
    .catch(err => console.error(err))
}

    const updateCar = (car, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    

  //Tietorivit auton tiedoille
    const columns = [

        {
            Header: 'Brand',
            accessor: 'brand'
        },

        {
            Header: 'Model',
            accessor: 'model'
        },

        {
            Header: 'Color',
            accessor: 'color'
        },

        {
            Header: 'Fuel',
            accessor: 'fuel'
        },
        {
            Header: 'Year',
            accessor: 'year'
        },
        {
            Header: 'Price',
            accessor: 'price'
        },
        {
            //Edit 
            sortable: false,
            filterable: false,
            width: 100,        
            Cell: row => <Editcar updateCar={updateCar} car={row.original} />
        },
        {
            //poistetaan sorttaus ja filtteröinti deletestä, asetetaan myös lopuksi painikkeen kooksi "small", sillä alkuperäinen koko on liian iso.
            sortable: false,
            filterable: false,
            width: 100,
            accessor: '_links.self.href',
            Cell: row => <Button size="small" color="secondary" onClick={() => deleteCar(row.value) }>Delete</Button>
        },
        

    ]

    return (
        <div>
        <Addcar saveCar={saveCar} />
        <ReactTable filterable={true} data={cars} columns={columns} />
        
        <Button onClick={handleClick}>Open simple snackbar</Button>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          autoHideDuration={3000}//kesto vaihdettu 6000ms => 3000ms, mielestäni aika oli liian pitkä (ei muuta merkitystä)
          onClose={handleClose}
          message="Row deleted"/>
      </div>
    )
}