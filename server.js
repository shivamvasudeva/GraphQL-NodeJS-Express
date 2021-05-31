const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLSchema,
  GraphQLNonNull,
} = require('graphql')
const app = express()

const brands = [
	{ id: 1, name: 'Acura' },
	{ id: 2, name: 'BMW' },
	{ id: 3, name: 'Audi' },
  { id: 4, name: 'Benz' }
]

const cars = [
	{ id: 1, name: 'ILX', brandId: 1 },
	{ id: 2, name: 'TLX', brandId: 1 },
	{ id: 3, name: 'MDX', brandId: 1 },
	{ id: 4, name: 'X5', brandId: 2 },
	{ id: 5, name: '350i', brandId: 2 },
	{ id: 6, name: 'X7', brandId: 2 },
	{ id: 7, name: 'A8', brandId: 3 },
	{ id: 8, name: 'Q7', brandId: 3 },
	{ id: 9, name: 'C Class', brandId: 4 },
	{ id: 10, name: 'E Class', brandId: 4 },
	{ id: 11, name: 'S Class', brandId: 4 }
  
]

const carType = new GraphQLObjectType({
  name: 'car',
  description: 'This represents a car written by an brand',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    brandId: { type: GraphQLNonNull(GraphQLInt) },
    brand: {
      type: brandType,
      resolve: (car) => {
        return brands.find(brand => brand.id === car.brandId)
      }
    }
  })
})

const brandType = new GraphQLObjectType({
  name: 'brand',
  description: 'This represents a brand of a car',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    cars: {
      type: new GraphQLList(carType),
      resolve: (brand) => {
        return cars.filter(car => car.brandId === brand.id)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    car: {
      type: carType,
      description: 'A Single car',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => cars.find(car => car.id === args.id)
    },
    cars: {
      type: new GraphQLList(carType),
      description: 'List of All cars',
      resolve: () => cars
    },
    brands: {
      type: new GraphQLList(brandType),
      description: 'List of All brands',
      resolve: () => brands
    },
    brand: {
      type: brandType,
      description: 'A Single brand',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => brands.find(brand => brand.id === args.id)
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addcar: {
      type: carType,
      description: 'Add a car',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        brandId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const car = { id: cars.length + 1, name: args.name, brandId: args.brandId }
        cars.push(car)
        return car
      }
    },
    addbrand: {
      type: brandType,
      description: 'Add an brand',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const brand = { id: brands.length + 1, name: args.name }
        brands.push(brand)
        return brand
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

app.use('/graphql',expressGraphQL({
  schema: schema,
  graphiql: true
}))
app.listen(5000, () => console.log('Server is Working.....'))