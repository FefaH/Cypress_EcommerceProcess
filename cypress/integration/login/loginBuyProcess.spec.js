const generateName = () => {
    const firstname = ["Adrian", "Agustn", "Alberto", "Alejandro", "Alexander", "Alexis", "Alonso", "Andres Felipe", "Angel", "Anthony", "Antonio", "Bautista", "Benicio", "Benjamn", "Carlos", "Carlos Alberto", "Carlos Eduardo", "Carlos Roberto", "Cear", "Cristobal", "Daniel", "David", "Diego", "Dylan", "Eduardo", "Emiliano", "Emmanuel", "Enrique", "Erik", "Ernesto", "Ethan", "Fabian", "Facundo", "Felipe", "Felix", "Felix Maria", "Fernando", "Francisco", "Francisco Javier", "Gabriel", "Gaspar", "Gustavo Adolfo", "Hugo", "Ian", "Iker", "Isaac", "Jacob", "Javier", "Jayden", "Jeremy", "Jeronimo", "Jesus", "Jesus Antonio", "Jesus Victor", "Joaquin", "Jorge", "Jorge  Alberto", "Jorge Luis", "Jose", "Jose Antonio", "Jose Daniel", "Jose David", "Jose Francisco", "Jose Gregorio", "Jose Luis", "Jose Manuel", "Jose Pablo", "Josue", "Juan", "Juan Angel", "Juan Carlos", "Juan David", "Juan Esteban", "Juan Ignacio", "Juan Jose", "Juan Manuel", "Juan Pablo", "Juan Sebastian", "Julio", "Julio Cesar", "Justin", "Kevin", "Lautaro", "Liam", "Lian", "Lorenzo", "Lucas", "Luis", "Luis Alberto", "Luis Emilio", "Luis Fernando", "Manuel", "Manuel Antonio", "Marco Antonio", "Mario", "Martin", "Mateo", "Matias", "Maximiliano", "Maykel", "Miguel", "Miguel  ngel", "Nelson", "Noah", "Oscar", "Pablo", "Pedro", "Rafael", "Ramon", "Raul", "Ricardo", "Rigoberto", "Roberto", "Rolando", "Samuel", "Samuel David", "Santiago", "Santino", "Santos", "Sebastian", "Thiago", "Thiago Benjamin", "Tomas", "Valentino", "Vicente", "Victor", "Victor Hugo"];
    const lastname = ["Garcia", "Gonzalez", "Rodriguez", "Fernandez", "Lopez", "Martinez", "Sanchez", "Perez", "Gomez", "Martin", "Jimenez", "Ruiz", "Hernandez", "Diaz", "Moreno", "Alvarez", "Muñoz", "Romero", "Alonso", "Gutierrez", "Navarro", "Torres", "Dominguez",
        "Vazquez", "Ramos", "Gil", "Ramirez", "Serrano", "Blanco", "Suarez", "Molina", "Morales", "Ortega", "Delgado", "Castro", "Ortiz", "Rubio", "Marin", "Sanz", "Nuñez", "Iglesias", "Medina", "Garrido", "Santos", "Castillo", "Cortes", "Lozano", "Guerrero", "Cano", "Prieto", "Mendez", "Calvo", "Cruz", "Gallego", "Vidal", "Leon", "Herrera", "Marquez", "Peña", "Cabrera", "Flores", "Campos", "Vega", "Diez", "Fuentes", "Carrasco", "Caballero", "Nieto", "Reyes", "Aguilar", "Pascual", "Herrero", "Santana", "Lorenzo", "Hidalgo", "Montero", "Ibañez", "Gimenez", "Ferrer", "Duran", "Vicente", "Benitez", "Mora", "Santiago", "Arias", "Vargas", "Carmona", "Crespo", "Roman", "Pastor", "Soto", "Saez", "Velasco", "Soler", "Moya", "Esteban", "Parra", "Bravo", "Gallardo", "Rojas", "Pardo", "Merino", "Franco", "Espinosa", "Izquierdo", "Lara", "Rivas", "Silva", "Rivera", "Casado", "Arroyo", "Redondo", "Camacho", "Rey", "Vera", "Otero", "Luque", "Galan", "Montes", "Rios", "Sierra", "Segura", "Carrillo", "Marcos", "Marti", "Soriano", "Mendoza"];
    var rand_first = Math.floor(Math.random() * firstname.length);
    var rand_last = Math.floor(Math.random() * lastname.length);

    return (firstname[rand_first] + ' ' + lastname[rand_last])
}

const userName = generateName()
const randomNumber = (max, min) => {
    return Math.floor(Math.random() * (max - min)) + min;
}
const signPass = randomNumber(100000, 999999)

describe('login page', () => {
    beforeEach(() => {
        cy.intercept({
            method: 'POST',
            url: 'https://api.demoblaze.com/bycat'
        }).as('laptopsPage')
        cy.intercept({
            method: 'GET',
            url: 'https://hls.demoblaze.com/about_demo_hls_600k00000.ts'
        }).as('addToCar')
        cy.fixture('countries.json').as('countriesData')
        cy.fixture('month.json').as('monthData')
    })
    it('visit page', () => {
        cy.visit('https://www.demoblaze.com/index.html')
    })
    it('user sign up', () => {
        cy.get('#signin2').click()
        cy.get('#sign-username').wait(2000).focus().type(userName.replace(/\s+/g, ''))
        cy.get('#sign-password').type(signPass)
        cy.get('#signInModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click()
    })
    it('login user + buy process + logout', () => {
        cy.get('#login2').click()
        cy.get('#loginusername').wait(2000).focus().type(userName.replace(/\s+/g, ''))
        cy.get('#loginpassword').type(signPass)
        cy.get('#logInModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click()
        cy.wait(2000)
        cy.get(`[onclick="byCat('notebook')"]`).click()
        cy.wait('@laptopsPage')
        cy.get(':nth-child(6) > .card > .card-block > .card-title > .hrefch').click()
        cy.wait('@addToCar')
        cy.wait(2000)
        cy.get('.col-sm-12 > .btn').click()
        cy.get(':nth-child(4) > .nav-link').click()
        cy.get('.col-lg-1 > .btn').click()
        cy.get('#name').type(userName)
        cy.get('@countriesData').then(data => {
            const countriesId = randomNumber(1, 229)
            const findCountrie = data.find(element => element.id === countriesId)
            cy.wait(1000)
            cy.get('#country').type(findCountrie.name)
            cy.get('#city').type(findCountrie.name + ' City 🏙')
        })
        cy.get('#card').type(randomNumber(1000000000000000, 9999999999999999))
        cy.get('@monthData').then(data => {
            const monthId = randomNumber(1, 12)
            const findMonth = data.find(element => element.id === monthId)

            cy.get('#month').type(findMonth.name)
        })
        cy.get('#year').type(randomNumber(1930, 2023))
        cy.wait(3000)
        cy.get('#orderModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click()
        cy.wait(2000)
        cy.get('.confirm').click()
        cy.wait(1000)
        cy.get('#logout2').click()
    })

})