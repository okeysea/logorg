Rails.application.routes.draw do
  root 'static_pages#home'
  get 'static_pages/home'
  get 'static_pages/help'

  get  '/signup', to: 'users#new'
  post '/signup', to: 'users#create'

  get  '/login',  to: 'sessions#new'
  post '/login',  to: 'sessions#create'

  resources :users, param: :public_id
  resources :account_activations, only: [:edit]
end
