from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, restaurants, wishlist, ratings, top_rated_weekly, friends, users
from datetime import date

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                    "https://localhost:3000",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.middleware("http")
# async def log_requests(request, call_next):
#     print(f"🌐 {request.method} {request.url} - Origin: {request.headers.get('origin')}")
#     response = await call_next(request)
#     return response

# @app.middleware("http")
# async def log_cors_headers(request, call_next):
#     response = await call_next(request)
#     print(f"🌐 Response headers: {dict(response.headers)}")
#     return response


app.include_router(auth.router,prefix="/auth",tags=["auth"])
app.include_router(restaurants.router, prefix="/restaurants", tags=["restaurants"])
app.include_router(wishlist.router, prefix="/wishlist", tags=["wishlist"])
app.include_router(ratings.router, prefix="/rating",tags=["rating"])
app.include_router(top_rated_weekly.router, prefix="/top-rated-weekly", tags=["top-rated-weekly"])
app.include_router(friends.router, prefix="/friends", tags=["friends"])
app.include_router(users.router, prefix="/users", tags=["users"])
