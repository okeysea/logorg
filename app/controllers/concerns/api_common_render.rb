module ApiCommonRender
  extend ActiveSupport::Concern

  included do
  end

  # モデルのバリデーションエラー用
  def render_error_model(model, status: :unprocessable_entity, message: "validation error")

    @render_model_name = model.class.name
    @render_message = message
    @render_errors = model.errors.keys.map do |field|
      {
        resource: @render_model_name,
        field: field,
        messages: model.errors.full_messages_for( field )
      }
    end

    render render_path('error_model'), status: status and return
  end

  def render_not_found(status: :not_found, message: "not found")
    @render_message = message
    render render_path('message'), status: status and return
  end

  private
    def render_path(name)
      format("api/v1/common/%<name>s", name: name)
    end

end
