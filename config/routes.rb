Rails.application.routes.draw do
  root    'static_pages#home'
  get     'static_pages/home'
  get     'static_pages/help'

  get     '/signup', to: 'users#new'
  post    '/signup', to: 'users#create'

  get     '/login',  to: 'sessions#new'
  post    '/login',  to: 'sessions#create'
  delete  '/logout', to: 'sessions#destroy'

  resources :users, param: :public_id do
    resources :posts
  end

  resources :account_activations, only: [:edit]

  # API
  namespace :api, { format: 'json' } do
    namespace :v1 do
      resources :users, except: [:new, :edit], param: :public_id # APIにnew, editは不要なためexcept
      resources :posts, except: [:new, :edit]
      # resources :sessions, only: [:destroy]
      delete 'sessions', to: 'sessions#destroy'
    end
  end
end
