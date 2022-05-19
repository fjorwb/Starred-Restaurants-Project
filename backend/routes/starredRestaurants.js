const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */

  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.restaurantId,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.status(200).json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
router.get("/:id", (req, res) => {
  const id = req.params.id

  const starred = STARRED_RESTAURANTS.find((star) => star.restaurantId === id)
  const restaurants = ALL_RESTAURANTS.find((restaurant) => restaurant.id === starred.restaurantId)

  const starredRestaurant = {id: starred.restaurantId, name: restaurants.name, comments: starred.comment}

  res.status(200).json(starredRestaurant);

});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post("/", (req, res) => {
  const {restaurantId, comment} = req.body

  const starredRestaurant = STARRED_RESTAURANTS.filter((starred) => starred.restaurantId === restaurantId)
  console.log(starredRestaurant)
  
  console.log(starredRestaurant.length)

  if(!starredRestaurant || starredRestaurant.length !== 0) {
    return res.status(500).json('Restaurant already exist')
  }

    // Generate a unique ID for the new restaurant.
  const newId = uuidv4();

  const newStarredRestaurant = {id:newId, restaurantId, comment}

  STARRED_RESTAURANTS = [...STARRED_RESTAURANTS, newStarredRestaurant ]

  res.status(201).json(newStarredRestaurant)

})

/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
router.delete('/:id', (req, res) => {
  const id = req.params.id

  const starredRestaurants = STARRED_RESTAURANTS.find((starred) => starred.restaurantId === id)
  console.log(starredRestaurants);

  if(!starredRestaurants || starredRestaurants.length === 0) {
    return res.status(404).json(`restaurant with id:${id} does not exist in Starred Restaurants list`)
  }

  if(starredRestaurants.isNull) {
    return res.status(500).json(`restaurant with id:${id} does not exist in Starred Restaurants list!!!!`)
  }

  STARRED_RESTAURANTS = starredRestaurants
  console.log(STARRED_RESTAURANTS);

  return res.status(301).json(`restaurant with id:${id} deleted successfully`)
})


/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
router.put('/:id', (req, res) => {
  const id = req.params.id
  const {newComment} = req.body
  
  const starredRestaurant = STARRED_RESTAURANTS.find((starred) => starred.restaurantId === id)

  if(!starredRestaurant) {
    return res.status(404).json(`restaurant with id:${id} does not exist in Starred Restaurants list`)
  }

  starredRestaurant.comment = newComment
  console.log(starredRestaurant)
  console.log(STARRED_RESTAURANTS)

  res.status(202).json(`comment updated for restaurant with id:${id}`)
})

module.exports = router;